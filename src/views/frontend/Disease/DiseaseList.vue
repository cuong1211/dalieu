<template>
    <div class="container my-8">
      <div class="row">
        <!-- Left sidebar for disease categories -->
        <div class="col-lg-3">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Danh mục bệnh</h3>
            </div>
            <div class="card-body">
              <div class="menu menu-column menu-rounded menu-sub-indention">
                <div v-for="category in categories" :key="category.id" class="menu-item">
                  <a href="#" class="menu-link" @click.prevent="filterByCategory(category.id)">
                    <span class="menu-bullet">
                      <span class="bullet bullet-dot"></span>
                    </span>
                    <span class="menu-title">{{ category.name }}</span>
                    <span class="menu-badge">
                      <span class="badge badge-light-primary">{{ category.count }}</span>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Main content -->
        <div class="col-lg-9">
          <!-- Search and filters -->
          <div class="card mb-6">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="position-relative w-100">
                  <span class="svg-icon svg-icon-3 svg-icon-gray-500 position-absolute top-50 translate-middle ms-6">
                    <i class="bi bi-search"></i>
                  </span>
                  <input type="text" 
                         v-model="searchQuery"
                         class="form-control form-control-solid ps-10" 
                         placeholder="Tìm kiếm bệnh..." />
                </div>
              </div>
            </div>
          </div>
  
          <!-- Disease list -->
          <div class="row g-6">
            <div v-for="disease in filteredDiseases" 
                 :key="disease.id" 
                 class="col-md-6">
              <div class="card h-100">
                <div class="card-body d-flex flex-column">
                  <div class="mb-5">
                    <div class="d-flex align-items-center mb-2">
                      <img :src="disease.image" 
                           :alt="disease.name"
                           class="w-50px h-50px rounded me-3" />
                      <h3 class="fs-4 fw-bold mb-0">
                        <RouterLink :to="disease.route" class="text-dark text-hover-primary">
                          {{ disease.name }}
                        </RouterLink>
                      </h3>
                    </div>
                    <p class="text-gray-600 fs-6 mb-0">{{ disease.shortDescription }}</p>
                  </div>
                  <div class="mt-auto">
                    <RouterLink :to="disease.route" 
                              class="btn btn-sm btn-light-primary">
                      Chi tiết
                    </RouterLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  
  interface Category {
    id: number;
    name: string;
    count: number;
  }
  
  interface Disease {
    id: number;
    name: string;
    image: string;
    shortDescription: string;
    route: { name: string };
    categoryId: number;
  }
  
  const searchQuery = ref('');
  const selectedCategory = ref<number | null>(null);
  
  const categories = ref<Category[]>([
    { id: 1, name: 'Bệnh da phổ biến', count: 8 },
    { id: 2, name: 'Bệnh nhiễm trùng', count: 5 },
    { id: 3, name: 'Rối loạn sắc tố', count: 3 },
    { id: 4, name: 'Bệnh tự miễn', count: 2 },
  ]);
  
  const diseases = ref<Disease[]>([
    {
      id: 1,
      name: 'Bệnh bạch biến',
      image: '/media/diseases/vitiligo.jpg',
      shortDescription: 'Bệnh bạch biến là một bệnh da do rối loạn sắc tố với các đám da giảm hoặc mất sắc tố...',
      route: { name: 'bach_bien' },
      categoryId: 3
    },
    {
      id: 2,
      name: 'Bệnh trứng cá',
      image: '/media/diseases/acne.jpg',
      shortDescription: 'Bệnh trứng cá là bệnh viêm da mãn tính ở nang lông và tuyến bã...',
      route: { name: 'trungca' },
      categoryId: 1
    },
    // Thêm các bệnh khác
  ]);
  
  const filterByCategory = (categoryId: number) => {
    selectedCategory.value = categoryId;
  };
  
  const filteredDiseases = computed(() => {
    let result = diseases.value;
    
    if (selectedCategory.value) {
      result = result.filter(disease => disease.categoryId === selectedCategory.value);
    }
    
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(disease => 
        disease.name.toLowerCase().includes(query) ||
        disease.shortDescription.toLowerCase().includes(query)
      );
    }
    
    return result;
  });
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
  </style>