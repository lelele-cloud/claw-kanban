import { useState, useEffect } from 'react'
import { useConfigStore } from '@/stores/configStore'
import { FormField, TextInput, SwitchInput, SaveButton } from '../common/FormField'
import type { DiscoveryConfig } from '@/types/config'

export function DiscoveryForm(): JSX.Element {
  const { config, patchConfig } = useConfigStore()
  const [discovery, setDiscovery] = useState<DiscoveryConfig>({})

  useEffect(() => {
    setDiscovery(config.discovery || {})
  }, [config.discovery])

  const save = async (): Promise<void> => {
    await patchConfig('discovery', discovery)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">mDNS</h3>

      <FormField label="mDNS Enabled">
        <SwitchInput
          checked={discovery.mdns?.enabled ?? false}
          onChange={(v) => setDiscovery({ ...discovery, mdns: { ...discovery.mdns, enabled: v } })}
        />
      </FormField>

      <FormField label="Service Name">
        <TextInput
          value={discovery.mdns?.serviceName || ''}
          onChange={(v) => setDiscovery({ ...discovery, mdns: { ...discovery.mdns, serviceName: v } })}
          placeholder="_openclaw._tcp"
        />
      </FormField>

      <div className="my-2 h-px bg-border" />

      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">DNS-SD</h3>

      <FormField label="DNS-SD Enabled">
        <SwitchInput
          checked={discovery.dnsSd?.enabled ?? false}
          onChange={(v) => setDiscovery({ ...discovery, dnsSd: { ...discovery.dnsSd, enabled: v } })}
        />
      </FormField>

      <SaveButton onClick={save} />
    </div>
  )
}
