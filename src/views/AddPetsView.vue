<script setup>
// importa as ferramentas do vue e do vue router
import { onMounted, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

// o endereço de onde vem os dados (o json-server)
const API_URL = 'http://localhost:3000';

// o router serve pra mudar de página pelo código
const router = useRouter();

// os dados do formulário (começam vazios)
const novoPet = ref({
  nome: '',
  especie: '',
  tutorId: '',
});

const tutores = ref([]); // lista de tutores que aparece no select
const carregandoTutores = ref(true); // true = ainda buscando os tutores
const salvando = ref(false); // true = enviando o pet pra API
const erro = ref(''); // guarda a mensagem de erro, se der ruim

/*
  busca os tutores na API pra montar o select.
  se der erro, mostra uma mensagem na tela.
*/
async function carregarTutores() {
  carregandoTutores.value = true;
  erro.value = '';

  try {
    const resposta = await fetch(`${API_URL}/tutores`);

    if (!resposta.ok) {
      throw new Error(`Erro ${resposta.status} ao buscar os tutores.`);
    }

    tutores.value = await resposta.json();
  } catch (e) {
    console.error(e);
    erro.value =
      'Não foi possível carregar os tutores. Verifique se a API está rodando.';
  } finally {
    carregandoTutores.value = false;
  }
}

/*
  envia o pet novo pra API (POST).
  se deu certo, volta pra listagem de pets.
*/
async function salvarPet() {
  salvando.value = true;
  erro.value = '';

  try {
    const resposta = await fetch(`${API_URL}/pets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(novoPet.value),
    });

    if (!resposta.ok) {
      throw new Error(`Erro ${resposta.status} ao salvar o pet.`);
    }

    // deu certo, então volta pra listagem
    router.push('/pets');
  } catch (e) {
    console.error(e);
    erro.value = 'Não foi possível salvar o pet. Tente novamente.';
  } finally {
    salvando.value = false;
  }
}

// quando a página abrir, busca os tutores
onMounted(carregarTutores);
</script>

<template>
  <div>
    <header class="mb-4">
      <h1 class="text-2xl font-bold">Novo Pet</h1>
      <p class="text-body-secondary mb-0">Cadastro de Pets no sistema.</p>
    </header>

    <!-- só aparece se deu erro -->
    <div
      v-if="erro"
      class="alert alert-danger"
      role="alert"
    >
      {{ erro }}
    </div>

    <!-- só aparece enquanto busca os tutores -->
    <p v-if="carregandoTutores">Carregando tutores...</p>

    <form
      v-else
      @submit.prevent="salvarPet"
    >
      <div class="col-md-6 mb-3">
        <label
          for="nome"
          class="form-label"
        >
          Nome do Pet
        </label>
        <input
          id="nome"
          v-model="novoPet.nome"
          type="text"
          class="form-control"
          required
        />
      </div>

      <div class="col-md-6 mb-3">
        <label
          for="especie"
          class="form-label"
        >
          Espécie
        </label>
        <select
          id="especie"
          v-model="novoPet.especie"
          class="form-select"
          required
        >
          <option value="">Selecione a espécie</option>
          <option value="Cachorro">Cachorro</option>
          <option value="Gato">Gato</option>
        </select>
      </div>

      <div class="col-md-6 mb-3">
        <label
          for="tutor"
          class="form-label"
        >
          Tutor
        </label>
        <!-- o v-model guarda o id do tutor escolhido em tutorId -->
        <select
          id="tutor"
          v-model="novoPet.tutorId"
          class="form-select"
          required
        >
          <option value="">Selecione o tutor</option>
          <option
            v-for="tutor in tutores"
            :key="tutor.id"
            :value="tutor.id"
          >
            {{ tutor.nome }}
          </option>
        </select>
      </div>

      <button
        type="submit"
        class="btn btn-primary me-2"
        :disabled="salvando"
      >
        {{ salvando ? 'Salvando...' : 'Salvar' }}
      </button>
      <RouterLink
        class="btn btn-outline-secondary"
        to="/pets"
      >
        Cancelar
      </RouterLink>
    </form>
  </div>
</template>