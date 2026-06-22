<!-- .vitepress/components/HomePage.vue -->
<script setup lang="ts">
import { useData } from 'vitepress'
import VPHero from 'vitepress/dist/client/theme-default/components/VPHero.vue'
import VPFeatures from 'vitepress/dist/client/theme-default/components/VPFeatures.vue'
import DebianNews from './debian-news.vue'

const { frontmatter } = useData()
</script>

<template>
  <div class="home-page">
    <!-- Hero section — full width -->
    <VPHero
      v-if="frontmatter.hero"
      :name="frontmatter.hero.name"
      :text="frontmatter.hero.text"
      :tagline="frontmatter.hero.tagline"
      :actions="frontmatter.hero.actions"
      :image="frontmatter.hero.image"
    />

    <!-- 2 column layout: Features + News -->
    <div class="home-body">
      <div class="home-left">
        <!-- Features -->
        <VPFeatures
          v-if="frontmatter.features"
          :features="frontmatter.features"
        />

        <!-- Common tasks slot -->
        <div class="common-tasks">
          <slot />
        </div>
      </div>

      <aside class="home-right">
        <DebianNews />
      </aside>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  padding-bottom: 4rem;
}

.home-body {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 2rem;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

.home-right {
  position: sticky;
  top: calc(var(--vp-nav-height) + 1rem);
  align-self: start;
  max-height: calc(100vh - var(--vp-nav-height) - 2rem);
  overflow-y: auto;
  &::-webkit-scrollbar {
        display: none;
    }
}

@media (max-width: 960px) {
  .home-body {
    grid-template-columns: 1fr;
  }

  .home-right {
    position: static;
    max-height: none;
  }
}
</style>
