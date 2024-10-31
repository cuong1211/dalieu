DistrictCommuneSelect.vue

<template>
     <div class="row g-8">
        <div class="col-lg-6">
            <label class="form-label">Huyện</label>
            <div class="custom-select" :class="{ 'is-invalid': districtError }" ref="districtSelectRef">
                <input type="text" class="form-control" v-model="selectedDistrictName"
                    @focus="showDistrictOptions = true" @input="onDistrictInput"
                    @change="$emit('change', 'district_id', selectedDistrict)" placeholder="Chọn hoặc tìm kiếm huyện" />
                <div v-if="showDistrictOptions" class="options-container">
                    <div class="search-container">
                        <input type="text" class="form-control search-input" v-model="districtSearchQuery"
                            @input="filterDistrictOptions" placeholder="Tìm kiếm huyện" />
                    </div>
                    <ul class="options-list">
                        <li @click="selectDistrict(null)">
                            -- Chọn huyện --
                        </li>
                        <li v-for="option in filteredDistrictOptions" :key="option.id" @click="selectDistrict(option)">
                            {{ option.name }}
                        </li>
                    </ul>
                </div>
            </div>
            <div v-if="districtError" class="invalid-feedback">{{ districtError }}</div>
        </div>

        <div class="col-lg-6">
            <label class="form-label">Xã</label>
            <div class="custom-select" :class="{ 'is-invalid': communeError }" ref="communeSelectRef">
                <input type="text" class="form-control" v-model="selectedCommuneName" @focus="showCommuneOptions = true"
                    @input="onCommuneInput" @change="$emit('change', 'commune_id', selectedCommuneId)"
                    placeholder="Chọn hoặc tìm kiếm xã" :disabled="!selectedDistrict" />
                <div v-if="showCommuneOptions && selectedDistrict" class="options-container">
                    <div class="search-container">
                        <input type="text" class="form-control search-input" v-model="communeSearchQuery"
                            @input="filterCommuneOptions" placeholder="Tìm kiếm xã" />
                    </div>
                    <ul class="options-list">
                        <li @click="selectCommune(null)">
                            -- Chọn xã --
                        </li>
                        <li v-for="option in filteredCommuneOptions" :key="option.commune_id"
                            @click="selectCommune(option)">
                            {{ option.name }}
                        </li>
                    </ul>
                </div>
            </div>
            <div v-if="communeError" class="invalid-feedback">{{ communeError }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';

const props = defineProps<{
    districtId: number | string;
    communeId: number | string;
    districtError?: string;
    communeError?: string;
}>();

const emit = defineEmits<{
    (e: 'update:districtId', value: number): void;
    (e: 'update:communeId', value: number): void;
    (e: 'change', field: string, value: number | null): void;
}>();

const userStore = useUserStore();

const selectedDistrict = ref<number | null>(null);
const selectedDistrictName = ref('');
const selectedCommuneId = ref<number | null>(null);
const selectedCommuneName = ref('');

const showDistrictOptions = ref(false);
const showCommuneOptions = ref(false);
const districtSearchQuery = ref('');
const communeSearchQuery = ref('');

const districtSelectRef = ref<HTMLElement | null>(null);
const communeSelectRef = ref<HTMLElement | null>(null);

const { districts } = storeToRefs(userStore);

const districtOptions = computed(() =>
    districts.value.map(d => ({ id: d.id, name: d.name }))
);

const selectedDistrictObject = computed(() =>
    districts.value.find(d => d.id === selectedDistrict.value)
);

const communeOptions = computed(() =>
    selectedDistrictObject.value?.communes.map(c => ({ commune_id: c.commune_id, name: c.name })) || []
);

const filteredDistrictOptions = ref(districtOptions.value);
const filteredCommuneOptions = ref(communeOptions.value);

const filterDistrictOptions = () => {
    const query = districtSearchQuery.value.toLowerCase();
    filteredDistrictOptions.value = districtOptions.value.filter(option =>
        option.name.toLowerCase().includes(query)
    );
};

const filterCommuneOptions = () => {
    const query = communeSearchQuery.value.toLowerCase();
    filteredCommuneOptions.value = communeOptions.value.filter(option =>
        option.name.toLowerCase().includes(query)
    );
};

const selectDistrict = (district: { id: number; name: string } | null) => {
    selectedDistrict.value = district?.id ?? null;
    selectedDistrictName.value = district?.name ?? '';
    showDistrictOptions.value = false;
    emit('update:districtId', district?.id ?? 0);
    emit('update:communeId', 0);
    selectedCommuneId.value = null;
    selectedCommuneName.value = '';
};

const selectCommune = (commune: { commune_id: number; name: string } | null) => {
    selectedCommuneId.value = commune?.commune_id ?? null;
    selectedCommuneName.value = commune?.name ?? '';
    showCommuneOptions.value = false;
    emit('update:communeId', commune?.commune_id ?? 0);
};

const onDistrictInput = () => {
    const district = districtOptions.value.find(d => d.name.toLowerCase() === selectedDistrictName.value.toLowerCase());
    if (district) {
        selectDistrict(district);
    } else {
        emit('update:districtId', 0);
    }
};

const onCommuneInput = () => {
    const commune = communeOptions.value.find(c => c.name.toLowerCase() === selectedCommuneName.value.toLowerCase());
    if (commune) {
        selectCommune(commune);
    } else {
        emit('update:communeId', 0);
    }
};

const handleClickOutside = (event: MouseEvent) => {
    if (districtSelectRef.value && !districtSelectRef.value.contains(event.target as Node)) {
        showDistrictOptions.value = false;
    }
    if (communeSelectRef.value && !communeSelectRef.value.contains(event.target as Node)) {
        showCommuneOptions.value = false;
    }
};

watch(() => props.districtId, (newValue) => {
    if (newValue !== selectedDistrict.value) {
        selectedDistrict.value = typeof newValue === 'string' ? parseInt(newValue, 10) : newValue;


        const district = districtOptions.value.find(d => d.id === newValue);

        if (district) {
            selectedDistrictName.value = district.name;
        } else {
            selectedDistrictName.value = '';
        }
        filterCommuneOptions();
    }
}, { immediate: true });

watch(() => props.communeId, (newValue) => {
    if (newValue !== selectedCommuneId.value) {
        selectedCommuneId.value = typeof newValue === 'string' ? parseInt(newValue, 10) : newValue;
        const commune = communeOptions.value.find(c => c.commune_id === newValue);
        if (commune) {
            selectedCommuneName.value = commune.name;
        } else {
            selectedCommuneName.value = '';
        }
    }
}, { immediate: true });

watch(selectedDistrict, () => {
    filterCommuneOptions();
});

watch(districts, () => {
    if (props.districtId) {
        const district = districts.value.find(d => d.id === props.districtId);
        if (district) {
            selectedDistrictName.value = district.name;
        }
    }
}, { immediate: true });


onMounted(async () => {
    await userStore.fetchDistrictsIfNeeded();
    filterDistrictOptions();
    filterCommuneOptions();

    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.custom-select {
    position: relative;
}

.options-container {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #ced4da;
    border-top: none;
    max-height: 200px;
    overflow-y: auto;
    z-index: 1000;
}

.search-container {
    position: sticky;
    top: 0;
    background: white;
    padding: 10px;
    z-index: 1001;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-input {
    width: 100%;
}

.options-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.options-list li {
    padding: 5px 10px;
    cursor: pointer;
}

.options-list li:hover {
    background-color: #f8f9fa;
}
</style>