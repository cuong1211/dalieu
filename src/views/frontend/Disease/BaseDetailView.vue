<template>
    <div class="container my-8">
        <div class="row">
            <!-- Main content -->
            <div class="col-lg-8">
                <div class="card">
                    <div class="card-body p-lg-8">
                        <!-- Disease header -->
                        <div class="d-flex flex-column flex-md-row align-items-md-center mb-8">
                            <div class="d-flex align-items-center mb-4 mb-md-0">
                                <img :src="diseaseData?.image" :alt="diseaseData?.name"
                                    class="w-100px h-100px rounded me-4" />
                                <div>
                                    <h1 class="fs-2 fw-bolder mb-1">{{ diseaseData?.name }}</h1>
                                    <div class="text-gray-600">{{ diseaseData?.category }}</div>
                                </div>
                            </div>
                        </div>

                        <!-- Disease content sections -->
                        <template v-for="(section, index) in diseaseData?.sections" :key="index">
                            <div class="mb-8" :id="`section-${index}`">
                                <h2 class="fs-3 fw-bold mb-4">{{ section.title }}</h2>

                                <!-- List type -->
                                <template v-if="section.type === 'list' && isStringArray(section.content)">
                                    <ul class="text-gray-700">
                                        <li v-for="(item, itemIndex) in section.content" :key="itemIndex" class="mb-2">
                                            {{ item }}
                                        </li>
                                    </ul>
                                </template>

                                <!-- Sections type -->
                                <template v-else-if="section.type === 'sections' && isSubsectionArray(section.content)">
                                    <div v-for="(subsection, subIndex) in section.content" :key="subIndex" class="mb-6">
                                        <h3 class="fs-4 fw-bold mb-3">{{ subsection.subtitle }}</h3>

                                        <!-- With items -->
                                        <template v-if="hasItems(subsection)">
                                            <div v-for="(item, itemIndex) in subsection.items" :key="itemIndex"
                                                class="mb-4">
                                                <h4 class="fs-5 fw-bold mb-2">{{ item.subtitle }}</h4>
                                                <ul class="text-gray-700">
                                                    <li v-for="(content, contentIndex) in item.content"
                                                        :key="contentIndex" class="mb-2">
                                                        {{ content }}
                                                    </li>
                                                </ul>
                                            </div>
                                        </template>

                                        <!-- With direct content -->
                                        <template v-else-if="subsection.content">
                                            <ul class="text-gray-700">
                                                <li v-for="(content, contentIndex) in subsection.content"
                                                    :key="contentIndex" class="mb-2">
                                                    {{ content }}
                                                </li>
                                            </ul>
                                        </template>
                                    </div>
                                </template>
                            </div>
                        </template>
                    </div>
                </div>
            </div>

            <!-- Sidebar -->
            <div class="col-lg-4">
                <!-- Related diseases -->
                <div class="card mb-6">
                    <div class="card-header">
                        <h3 class="card-title">Bệnh liên quan</h3>
                    </div>
                    <div class="card-body">
                        <div v-for="related in diseaseData?.relatedDiseases" :key="related.id"
                            class="d-flex align-items-center mb-4">
                            <img :src="related.image" :alt="related.name" class="w-50px h-50px rounded me-3" />
                            <div>
                                <RouterLink :to="{
                                    name: 'disease.detail',
                                    params: {
                                        id: related.id,
                                        name: related.name
                                    }
                                }" class="fs-6 fw-bold text-dark text-hover-primary mb-1 d-block">
                                    {{ related.name }}
                                </RouterLink>
                                <p class="text-gray-600 fs-7 mb-0">{{ related.description }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Table of contents -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Mục lục</h3>
                    </div>
                    <div class="card-body">
                        <div class="menu menu-column menu-rounded menu-sub-indention">
                            <div v-for="(section, index) in diseaseData?.sections" :key="index" class="menu-item">
                                <a :href="`#section-${index}`" class="menu-link"
                                    @click="scrollToSection($event, `section-${index}`)">
                                    <span class="menu-bullet">
                                        <span class="bullet bullet-dot"></span>
                                    </span>
                                    <span class="menu-title">{{ section.title }}</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getDiseaseData } from '@/data/diseases/index';
import type { Disease } from '@/types/disease';
import { isStringArray, isSubsectionArray, hasItems } from '@/types/disease';

const route = useRoute();
const diseaseData = ref<Disease | null>(null);

onMounted(() => {
    const routeName = route.name as string; // Lấy route name thay vì params id
    console.log('Current route name:', routeName); // Debug log
    diseaseData.value = getDiseaseData(routeName);
});

const scrollToSection = (e: Event, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
};
</script>
<style scoped>
.bullet-dot {
    width: 4px;
    height: 4px;
    border-radius: 100%;
    background-color: #B5B5C3;
    display: inline-block;
    margin-right: 0.75rem;
}

.menu-link {
    display: flex;
    align-items: center;
    padding: 0.65rem 1rem;
    color: #181C32;
    text-decoration: none;
}

.menu-link:hover {
    background-color: #F5F8FA;
    color: #009EF7;
}

:deep(.text-gray-700) {
    line-height: 1.8;
}

:deep(ul) {
    list-style-type: none;
    padding-left: 1.5rem;
}

:deep(li) {
    position: relative;
}

:deep(li)::before {
    content: "•";
    position: absolute;
    left: -1.5rem;
    color: #B5B5C3;
}

.mb-2 {
    margin-bottom: 0.75rem;
}

.mb-4 {
    margin-bottom: 1.5rem;
}

.mb-6 {
    margin-bottom: 2.25rem;
}
</style>