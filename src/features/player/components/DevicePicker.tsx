import { useState } from 'react'
import { ComputerIcon, DevicesIcon, SmartphoneIcon, SpeakerIcon } from '@/components/icons/PlayerIcons'
import { useGetDevicesQuery, useTransferPlaybackMutation } from '../playerApi'

function DeviceTypeIcon({ type }: { type: string }) {
  if (type === 'Smartphone') return <SmartphoneIcon />
  if (type === 'Speaker') return <SpeakerIcon />
  return <ComputerIcon />
}

export function DevicePicker() {
  const [isOpen, setOpen] = useState(false)
  // Only fetch while the popover is actually open — no point polling in the background.
  const { data: devices } = useGetDevicesQuery(undefined, { skip: !isOpen })
  const [transferPlayback] = useTransferPlaybackMutation()

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Connect to a device"
        aria-expanded={isOpen}
        onClick={() => setOpen((open) => !open)}
        className="text-spotify-gray hover:text-white"
      >
        <DevicesIcon />
      </button>

      {isOpen && (
        <>
          {/* Click-outside catcher */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 bottom-full z-50 mb-3 w-64 rounded-lg bg-spotify-black-highlight p-3 shadow-2xl">
            <p className="mb-2 px-2 text-xs font-semibold uppercase text-spotify-gray">Connect to a device</p>
            {!devices && <p className="px-2 py-2 text-sm text-spotify-gray">Looking for devices…</p>}
            {devices && devices.length === 0 && <p className="px-2 py-2 text-sm text-spotify-gray">No devices found.</p>}
            {devices?.map((device) => (
              <button
                key={device.id ?? device.name}
                type="button"
                disabled={!device.id || device.is_restricted}
                onClick={() => {
                  if (!device.id) return
                  transferPlayback({ deviceId: device.id })
                  setOpen(false)
                }}
                className="flex w-full items-center gap-3 rounded px-2 py-2 text-left text-sm hover:bg-white/10 disabled:opacity-40"
              >
                <DeviceTypeIcon type={device.type} />
                <span className="min-w-0 flex-1 truncate">{device.name}</span>
                {device.is_active && <span className="h-2 w-2 shrink-0 rounded-full bg-spotify-green" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
