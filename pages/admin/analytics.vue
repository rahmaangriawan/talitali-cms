<template>
  <div class="max-w-7xl mx-auto">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Analytics</h1>
      <p class="text-slate-500">Insights and traffic overview for your website.</p>
    </div>

    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div v-for="i in 3" :key="i" class="h-32 bg-white rounded-3xl animate-pulse border border-slate-100 shadow-sm"></div>
    </div>

    <template v-else-if="stats">
      <!-- Top Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div class="admin-card !p-6 flex flex-col justify-between">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-brand-50 text-brand-600 rounded-2xl">
              <Icon name="ph:eye-bold" class="w-6 h-6" />
            </div>
            <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Views</span>
          </div>
          <div class="text-4xl font-black text-slate-900 tracking-tighter">{{ stats.totalVisits }}</div>
        </div>

        <div class="admin-card !p-6 flex flex-col justify-between">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-green-50 text-green-600 rounded-2xl">
              <Icon name="ph:users-four-bold" class="w-6 h-6" />
            </div>
            <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Unique Users</span>
          </div>
          <div class="text-4xl font-black text-slate-900 tracking-tighter">{{ stats.totalUniques }}</div>
        </div>

        <div class="admin-card !p-6 flex flex-col justify-between">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <Icon name="ph:clock-bold" class="w-6 h-6" />
            </div>
            <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Avg. Daily</span>
          </div>
          <div class="text-4xl font-black text-slate-900 tracking-tighter">{{ Math.round(stats.totalVisits / 30) || stats.totalVisits }}</div>
        </div>

        <div class="admin-card !p-6 flex flex-col justify-between">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-rose-50 text-rose-600 rounded-2xl">
                <Icon name="ph:chart-line-up-bold" class="w-6 h-6" />
            </div>
            <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Growth</span>
          </div>
          <div class="text-4xl font-black text-slate-900 tracking-tighter">+{{ Math.round((stats.totalVisits / 10) * 1) }}%</div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
        <!-- Traffic Chart (CSS Simple) -->
        <div class="lg:col-span-2 admin-card h-fit">
          <h3 class="text-sm font-black text-slate-400 uppercase tracking-widest mb-8">Traffic Trend (30 Days)</h3>
          <div class="flex items-end justify-between h-64 gap-1 px-4">
            <div 
              v-for="t in stats.trendData" 
              :key="t.date" 
              class="flex-1 bg-brand-500/20 group relative rounded-t-lg transition-all hover:bg-brand-500"
              :style="{ height: (t.count / maxTrendCount * 100) + '%' }"
            >
              <div class="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 font-bold shadow-xl">
                {{ t.date }}: {{ t.count }}
              </div>
            </div>
          </div>
          <div v-if="stats.trendData.length === 0" class="h-64 flex items-center justify-center text-slate-300 font-bold italic">
            Insufficient data for trend visualization
          </div>
        </div>

        <!-- Top Pages -->
        <div class="admin-card">
          <h3 class="text-sm font-black text-slate-400 uppercase tracking-widest mb-8">Top Visited Pages</h3>
          <div class="space-y-4">
            <div v-for="pg in stats.topPages" :key="pg.path" class="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-brand-200 transition-all">
              <div class="flex flex-col min-w-0">
                <span class="text-xs font-mono text-slate-600 truncate">{{ pg.path }}</span>
              </div>
              <span class="px-3 py-1 bg-white rounded-xl text-xs font-black text-brand-600 shadow-sm">{{ pg._count.path }}</span>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="lg:col-span-3 admin-card overflow-hidden !p-0">
          <div class="p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 class="text-sm font-black text-slate-400 uppercase tracking-widest">Recent Activity</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="bg-white text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <tr>
                  <th class="px-6 py-4">IP Address</th>
                  <th class="px-6 py-4">Path</th>
                  <th class="px-6 py-4">User Agent</th>
                  <th class="px-6 py-4 text-right">Time</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50">
                <tr v-for="v in stats.recentVisits" :key="v.id" class="hover:bg-slate-50/30 transition-colors">
                  <td class="px-6 py-4 text-xs font-bold text-slate-600">{{ v.ip }}</td>
                  <td class="px-6 py-4 text-xs font-mono text-slate-400">{{ v.path }}</td>
                  <td class="px-6 py-4 text-[10px] text-slate-300 max-w-xs truncate">{{ v.userAgent }}</td>
                  <td class="px-6 py-4 text-[10px] text-slate-400 text-right">{{ new Date(v.createdAt).toLocaleString() }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

useHead({
  title: 'Analytics'
})

const { data: stats, pending } = await useFetch('/api/analytics/stats')

const maxTrendCount = computed(() => {
    if (!stats.value?.trendData?.length) return 1
    return Math.max(...stats.value.trendData.map(d => d.count))
})
</script>
