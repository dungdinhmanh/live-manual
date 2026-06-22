<script setup lang="ts">
import { data as news } from './debian.data.ts'

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
</script>

<template>
  <div class="debian-news">
    <div v-if="!news.length" class="no-news">
      No news available.
    </div>

    <ul v-else class="news-list">
      <li v-for="item in news" :key="item.link" class="news-item">
        <a :href="item.link" target="_blank" rel="noopener noreferrer" class="news-title">
          {{ item.title }}
        </a>
        <time class="news-date">{{ formatDate(item.date) }}</time>
        <p class="news-desc">{{ item.description }}</p>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.debian-news {
  margin: 2rem 0;
}

.news-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.news-item {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 1rem 1.25rem;
  transition: border-color 0.2s;
}

.news-item:hover {
  border-color: var(--vp-c-brand-1);
}

.news-title {
  display: block;
  font-weight: 600;
  font-size: 1rem;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  margin-bottom: 0.25rem;
}

.news-title:hover {
  text-decoration: underline;
}

.news-date {
  display: block;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  margin-bottom: 0.5rem;
}

.news-desc {
  margin: 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-1);
  line-height: 1.6;
  /* Truncate dài quá */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.no-news {
  color: var(--vp-c-text-2);
  font-style: italic;
}
</style>
