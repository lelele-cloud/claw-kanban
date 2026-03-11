import { useState, useEffect, useCallback } from 'react'
import {
  Search,
  Download,
  Star,
  Loader2,
  ExternalLink,
  TrendingUp,
  Clock,
  BarChart3,
  ChevronDown,
  CheckCircle2,
  Trash2,
  RefreshCw
} from 'lucide-react'
import { cn } from '@/lib/utils'

type SortOption = 'installs' | 'trending' | 'updated' | 'stars' | 'downloads'

interface ClawHubSkill {
  slug: string
  name: string
  description: string
  owner: { handle: string }
  downloads?: number
  installs?: number
  installsAllTime?: number
  stars?: number
  version?: string
  updatedAt?: string
  highlighted?: boolean
  metadata?: {
    openclaw?: {
      emoji?: string
      homepage?: string
      os?: string[]
      primaryEnv?: string
      requires?: {
        env?: string[]
        bins?: string[]
        anyBins?: string[]
      }
    }
  }
}

const SORT_OPTIONS: Array<{ value: SortOption; label: string; icon: typeof TrendingUp }> = [
  { value: 'installs', label: 'Most Installed', icon: Download },
  { value: 'trending', label: 'Trending', icon: TrendingUp },
  { value: 'updated', label: 'Recently Updated', icon: Clock },
  { value: 'stars', label: 'Most Starred', icon: Star },
  { value: 'downloads', label: 'Most Downloaded', icon: BarChart3 }
]

interface SkillCardProps {
  skill: ClawHubSkill
  installed: boolean
  installing: boolean
  onInstall: (slug: string) => void
  onUninstall: (slug: string) => void
  onViewDetail: (slug: string) => void
}

function SkillCard({
  skill,
  installed,
  installing,
  onInstall,
  onUninstall,
  onViewDetail
}: SkillCardProps): JSX.Element {
  const emoji = skill.metadata?.openclaw?.emoji
  const requires = skill.metadata?.openclaw?.requires

  return (
    <div className="rounded-lg border bg-card p-3 hover:border-primary/50 transition-all">
      <div className="flex items-start justify-between mb-2">
        <button
          onClick={() => onViewDetail(skill.slug)}
          className="flex items-center gap-2 text-left hover:text-primary transition-colors"
        >
          {emoji ? (
            <span className="text-lg">{emoji}</span>
          ) : (
            <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
              {skill.slug.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium leading-tight">{skill.slug}</h3>
            <p className="text-[11px] text-muted-foreground">by {skill.owner.handle}</p>
          </div>
        </button>

        {installed ? (
          <div className="flex items-center gap-1">
            <span className="flex items-center gap-1 text-[10px] text-green-500">
              <CheckCircle2 className="h-3 w-3" />
              Installed
            </span>
            <button
              onClick={() => onUninstall(skill.slug)}
              className="ml-1 text-destructive/60 hover:text-destructive transition-colors"
              title="Uninstall"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => onInstall(skill.slug)}
            disabled={installing}
            className={cn(
              'flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition-colors',
              'bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50'
            )}
          >
            {installing ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Download className="h-3 w-3" />
            )}
            Install
          </button>
        )}
      </div>

      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{skill.description}</p>

      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
        {skill.installsAllTime != null && (
          <span className="flex items-center gap-0.5">
            <Download className="h-2.5 w-2.5" />
            {formatCount(skill.installsAllTime)}
          </span>
        )}
        {skill.stars != null && (
          <span className="flex items-center gap-0.5">
            <Star className="h-2.5 w-2.5" />
            {formatCount(skill.stars)}
          </span>
        )}
        {skill.version && <span>v{skill.version}</span>}
        {requires?.bins && requires.bins.length > 0 && (
          <span className="text-orange-400">needs: {requires.bins.join(', ')}</span>
        )}
        {skill.highlighted && (
          <span className="text-yellow-500 font-medium">Featured</span>
        )}
      </div>
    </div>
  )
}

function formatCount(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return String(n)
}

interface SkillDetailViewProps {
  slug: string
  installed: boolean
  installing: boolean
  onInstall: (slug: string) => void
  onUninstall: (slug: string) => void
  onBack: () => void
}

function SkillDetailView({
  slug,
  installed,
  installing,
  onInstall,
  onUninstall,
  onBack
}: SkillDetailViewProps): JSX.Element {
  const [detail, setDetail] = useState<ClawHubSkill | null>(null)
  const [skillMd, setSkillMd] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      window.api.clawhub.detail(slug),
      window.api.clawhub.file(slug).catch(() => '')
    ]).then(([d, md]) => {
      setDetail(d)
      setSkillMd(md)
      setLoading(false)
    })
  }, [slug])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    )
  }

  if (!detail) {
    return <p className="text-xs text-muted-foreground">Failed to load skill details.</p>
  }

  const meta = detail.metadata?.openclaw

  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="text-xs text-primary hover:text-primary/80 transition-colors"
      >
        &larr; Back to marketplace
      </button>

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {meta?.emoji ? (
            <span className="text-2xl">{meta.emoji}</span>
          ) : (
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
              {slug.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h2 className="text-base font-semibold">{slug}</h2>
            <p className="text-xs text-muted-foreground">
              by {detail.owner.handle} &middot; v{detail.version}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {meta?.homepage && (
            <button
              onClick={() => window.api.system.openExternal(meta.homepage!)}
              className="flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-muted transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              Docs
            </button>
          )}
          {installed ? (
            <button
              onClick={() => onUninstall(slug)}
              className="flex items-center gap-1 rounded-md border border-destructive/50 px-2 py-1 text-xs text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="h-3 w-3" />
              Uninstall
            </button>
          ) : (
            <button
              onClick={() => onInstall(slug)}
              disabled={installing}
              className="flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {installing ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              Install Skill
            </button>
          )}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">{detail.description}</p>

      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
        {detail.installsAllTime != null && (
          <span className="flex items-center gap-1">
            <Download className="h-3 w-3" /> {formatCount(detail.installsAllTime)} installs
          </span>
        )}
        {detail.stars != null && (
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3" /> {detail.stars} stars
          </span>
        )}
        {detail.updatedAt && (
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> Updated {new Date(detail.updatedAt).toLocaleDateString()}
          </span>
        )}
      </div>

      {meta?.requires && (
        <div className="rounded-lg border p-3 space-y-2">
          <h3 className="text-xs font-semibold">Requirements</h3>
          {meta.requires.env && meta.requires.env.length > 0 && (
            <div className="flex flex-wrap gap-1">
              <span className="text-[10px] text-muted-foreground">Env:</span>
              {meta.requires.env.map((e) => (
                <code key={e} className="text-[10px] bg-muted px-1 py-0.5 rounded">{e}</code>
              ))}
            </div>
          )}
          {meta.requires.bins && meta.requires.bins.length > 0 && (
            <div className="flex flex-wrap gap-1">
              <span className="text-[10px] text-muted-foreground">Binaries:</span>
              {meta.requires.bins.map((b) => (
                <code key={b} className="text-[10px] bg-muted px-1 py-0.5 rounded">{b}</code>
              ))}
            </div>
          )}
          {meta.os && meta.os.length > 0 && (
            <div className="flex flex-wrap gap-1">
              <span className="text-[10px] text-muted-foreground">OS:</span>
              {meta.os.map((o) => (
                <code key={o} className="text-[10px] bg-muted px-1 py-0.5 rounded">{o}</code>
              ))}
            </div>
          )}
        </div>
      )}

      {skillMd && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold">SKILL.md</h3>
          <pre className="rounded-lg border bg-muted/30 p-3 text-xs font-mono whitespace-pre-wrap max-h-[400px] overflow-y-auto">
            {skillMd}
          </pre>
        </div>
      )}
    </div>
  )
}

export function ClawHubMarketplace(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState('')
  const [sort, setSort] = useState<SortOption>('installs')
  const [skills, setSkills] = useState<ClawHubSkill[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nextCursor, setNextCursor] = useState<string | undefined>()
  const [installedSlugs, setInstalledSlugs] = useState<Set<string>>(new Set())
  const [installingSlugs, setInstallingSlugs] = useState<Set<string>>(new Set())
  const [detailSlug, setDetailSlug] = useState<string | null>(null)
  const [showSortMenu, setShowSortMenu] = useState(false)

  const loadInstalled = useCallback(async () => {
    const slugs = await window.api.clawhub.installed()
    setInstalledSlugs(new Set(slugs))
  }, [])

  const doSearch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      if (searchQuery.trim()) {
        const results = await window.api.clawhub.search(searchQuery.trim(), 30)
        setSkills(results)
        setNextCursor(undefined)
      } else {
        const result = await window.api.clawhub.list(sort, 30)
        setSkills(result.skills || [])
        setNextCursor(result.nextCursor)
      }
    } catch (err) {
      setError(String(err))
      setSkills([])
    } finally {
      setLoading(false)
    }
  }, [searchQuery, sort])

  useEffect(() => {
    loadInstalled()
  }, [loadInstalled])

  useEffect(() => {
    doSearch()
  }, [sort]) // Re-fetch when sort changes; search is triggered by button/enter

  const handleSearchSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    doSearch()
  }

  const loadMore = async (): Promise<void> => {
    if (!nextCursor || loading) return
    setLoading(true)
    try {
      const result = await window.api.clawhub.list(sort, 30, nextCursor)
      setSkills((prev) => [...prev, ...(result.skills || [])])
      setNextCursor(result.nextCursor)
    } catch (err) {
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }

  const handleInstall = async (slug: string): Promise<void> => {
    setInstallingSlugs((prev) => new Set([...prev, slug]))
    try {
      await window.api.clawhub.install(slug)
      setInstalledSlugs((prev) => new Set([...prev, slug]))
    } catch (err) {
      setError(`Failed to install ${slug}: ${err}`)
    } finally {
      setInstallingSlugs((prev) => {
        const next = new Set(prev)
        next.delete(slug)
        return next
      })
    }
  }

  const handleUninstall = async (slug: string): Promise<void> => {
    try {
      await window.api.clawhub.uninstall(slug)
      setInstalledSlugs((prev) => {
        const next = new Set(prev)
        next.delete(slug)
        return next
      })
    } catch (err) {
      setError(`Failed to uninstall ${slug}: ${err}`)
    }
  }

  if (detailSlug) {
    return (
      <SkillDetailView
        slug={detailSlug}
        installed={installedSlugs.has(detailSlug)}
        installing={installingSlugs.has(detailSlug)}
        onInstall={handleInstall}
        onUninstall={handleUninstall}
        onBack={() => setDetailSlug(null)}
      />
    )
  }

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills on ClawHub..."
            className="h-8 w-full rounded-md border bg-background pl-7 pr-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-primary px-3 py-1 text-xs text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Search
        </button>
      </form>

      {/* Sort & controls */}
      <div className="flex items-center justify-between">
        <div className="relative">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {SORT_OPTIONS.find((o) => o.value === sort)?.label || 'Sort'}
            <ChevronDown className="h-3 w-3" />
          </button>
          {showSortMenu && (
            <div className="absolute top-full left-0 z-10 mt-1 rounded-md border bg-popover p-1 shadow-md">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setSort(opt.value)
                    setShowSortMenu(false)
                  }}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-xs transition-colors',
                    sort === opt.value
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-muted'
                  )}
                >
                  <opt.icon className="h-3 w-3" />
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground">
            {installedSlugs.size} installed
          </span>
          <button
            onClick={() => {
              loadInstalled()
              doSearch()
            }}
            className="text-muted-foreground hover:text-foreground transition-colors"
            title="Refresh"
          >
            <RefreshCw className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline">
            dismiss
          </button>
        </div>
      )}

      {/* Skills grid */}
      {loading && skills.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="ml-2 text-xs text-muted-foreground">Loading skills from ClawHub...</span>
        </div>
      ) : skills.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-xs text-muted-foreground">
            {searchQuery ? 'No skills found for your search.' : 'No skills loaded.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {skills.map((skill) => (
            <SkillCard
              key={skill.slug}
              skill={skill}
              installed={installedSlugs.has(skill.slug)}
              installing={installingSlugs.has(skill.slug)}
              onInstall={handleInstall}
              onUninstall={handleUninstall}
              onViewDetail={setDetailSlug}
            />
          ))}
        </div>
      )}

      {/* Load more */}
      {nextCursor && !searchQuery && (
        <button
          onClick={loadMore}
          disabled={loading}
          className="w-full rounded-md border py-2 text-xs text-muted-foreground hover:bg-muted disabled:opacity-50 transition-colors"
        >
          {loading ? (
            <Loader2 className="h-3 w-3 animate-spin mx-auto" />
          ) : (
            'Load more skills'
          )}
        </button>
      )}

      {/* ClawHub link */}
      <div className="text-center pt-2">
        <button
          onClick={() => window.api.system.openExternal('https://clawhub.ai')}
          className="text-[10px] text-muted-foreground hover:text-primary transition-colors"
        >
          Browse more on clawhub.ai &rarr;
        </button>
      </div>
    </div>
  )
}
