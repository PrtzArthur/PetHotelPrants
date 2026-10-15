import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/pets',
    },
    {
      path: '/pets',
      name: 'pets',
      component: () => import('../views/PetViews.vue'),
    },
    {
      path: '/pets/novo',
      name: 'addPet',
      component: () => import('../views/AddPetsView.vue'),
    },
    {
      path: '/pets/:id',
      name: 'petDetails',
      component: () => import('../views/PetDetailsView.vue'),
    },
  ],
});

export default router;