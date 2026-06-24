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
    <!-- Hero — full width -->
    <VPHero
      v-if="frontmatter.hero"
      :name="frontmatter.hero.name"
      :text="frontmatter.hero.text"
      :tagline="frontmatter.hero.tagline"
      :actions="frontmatter.hero.actions"
      :image="frontmatter.hero.image"
    />

    <!-- Features -->
    <div class="home-features">
      <VPFeatures
        v-if="frontmatter.features"
        :features="frontmatter.features"
      />
    </div>

    <!-- Debian News — full width under features, horizontal scroll (newest left → right) -->
    <section class="home-news">
      <h2 class="home-news-title">Debian News</h2>
      <DebianNews />
    </section>
  </div>
</template>

<style scoped>
.home-page {
  padding-bottom: 4rem;
}

/* Debian News — full-width band under the features. */
.home-news {
  max-width: 1152px;
  margin: 48px auto 0;
}

.home-news-title {
  margin: 0 0 16px;
  font-family: 'DM Sans', sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1;
}

.home-features {
  margin-top: 48px;
}
</style>
