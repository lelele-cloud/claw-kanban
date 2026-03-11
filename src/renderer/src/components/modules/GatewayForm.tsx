import { useState, useEffect } from 'react'
import { useConfigStore } from '@/stores/configStore'
import { FormField, TextInput, SelectInput, NumberInput, SaveButton } from '../common/FormField'
import type { GatewayConfig } from '@/types/config'

export function GatewayForm(): JSX.Element {
  const { config, patchConfig } = useConfigStore()
  const [gw, setGw] = useState<GatewayConfig>({})

  useEffect(() => {
    setGw(config.gateway || {})
  }, [config.gateway])

  const save = async (): Promise<void> => {
    await patchConfig('gateway', gw)
  }

  return (
    <div className="space-y-4">
      <FormField label="Port" description="Gateway listen port (default: 18789)">
        <NumberInput
          value={gw.port}
          onChange={(v) => setGw({ ...gw, port: v })}
          placeholder="18789"
          min={1}
          max={65535}
        />
      </FormField>

      <FormField label="Bind" description="Network binding mode">
        <SelectInput
          value={gw.bind || 'loopback'}
          onChange={(v) => setGw({ ...gw, bind: v })}
          options={[
            { value: 'loopback', label: 'Loopback (localhost only)' },
            { value: 'lan', label: 'LAN (local network)' },
            { value: 'tailnet', label: 'Tailscale' },
            { value: '0.0.0.0', label: 'All interfaces' }
          ]}
        />
      </FormField>

      <FormField label="Authentication Type">
        <SelectInput
          value={gw.auth?.type || 'token'}
          onChange={(v) =>
            setGw({ ...gw, auth: { ...gw.auth, type: v as GatewayConfig['auth'] extends { type: infer T } ? T : never } })
          }
          options={[
            { value: 'token', label: 'Token' },
            { value: 'password', label: 'Password' },
            { value: 'trusted-proxy', label: 'Trusted Proxy' },
            { value: 'none', label: 'None' }
          ]}
        />
      </FormField>

      {gw.auth?.type === 'token' && (
        <FormField label="Auth Token">
          <TextInput
            value={(gw.auth?.token as string) || ''}
            onChange={(v) => setGw({ ...gw, auth: { ...gw.auth!, token: v } })}
            placeholder="sk-..."
            type="password"
          />
        </FormField>
      )}

      <FormField label="Hot Reload Mode" description="How config changes are applied">
        <SelectInput
          value={gw.reload?.mode || 'hybrid'}
          onChange={(v) =>
            setGw({ ...gw, reload: { ...gw.reload, mode: v as 'hybrid' | 'hot' | 'restart' | 'off' } })
          }
          options={[
            { value: 'hybrid', label: 'Hybrid (recommended)' },
            { value: 'hot', label: 'Hot (safe changes only)' },
            { value: 'restart', label: 'Restart on change' },
            { value: 'off', label: 'Disabled' }
          ]}
        />
      </FormField>

      {gw.tailscale && (
        <FormField label="Tailscale Mode">
          <SelectInput
            value={gw.tailscale.mode || 'off'}
            onChange={(v) => setGw({ ...gw, tailscale: { mode: v as 'serve' | 'funnel' | 'off' } })}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'serve', label: 'Serve' },
              { value: 'funnel', label: 'Funnel' }
            ]}
          />
        </FormField>
      )}

      <SaveButton onClick={save} />
    </div>
  )
}
