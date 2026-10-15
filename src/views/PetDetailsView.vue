<script setup>
// importa as ferramentas do vue e do vue router
import { onMounted, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

// o endereço de onde vem os dados (o json-server)
const API_URL = 'http://localhost:3000';

// o route guarda as informações da rota atual, como o :id da URL
const route = useRoute();

const pet = ref(null); // o pet que vamos mostrar (começa vazio)
const tutor = ref(null); // o tutor desse pet (começa vazio)
const carregando = ref(true); // true = ainda carregando, false = já carregou
const erro = ref(''); // guarda a mensagem de erro, se der ruim

/*
  busca o pet pelo id que está na URL (/pets/ID).
  depois busca o tutor dele pelo tutorId.
  se o pet não existir, mostra um aviso na tela.
*/
async function carregarPet() {
  carregando.value = true; // avisa que começou a carregar
  erro.value = ''; // limpa o erro de antes, se tinha

  try {
    // pega o id que está na URL
    const id = route.params.id;

    // pede o pet pra API e espera a resposta chegar
    const resposta = await fetch(`${API_URL}/pets/${id}`);

    // 404 quer dizer que não existe pet com esse id
    if (resposta.status === 404) {
      erro.value = 'Pet não encontrado.';
      return;
    }

    // qualquer outro erro, joga pro catch
    if (!resposta.ok) {
      throw new Error(`Erro ${resposta.status} ao buscar o pet.`);
    }

    pet.value = await resposta.json();

    // agora busca o tutor desse pet
    const respostaTutor = await fetch(
      `${API_URL}/tutores/${pet.value.tutorId}`,
    );

    // se o tutor não existir, a tela mostra um aviso no lugar dos dados
    if (respostaTutor.ok) {
      tutor.value = await respostaTutor.json();
    }
  } catch (e) {
    console.error(e); // mostra o erro no console
    erro.value =
      'Não foi possível carregar o pet. Verifique se a API está rodando.';
  } finally {
    // isso roda sempre, deu certo ou errado: tira o "carregando"
    carregando.value = false;
  }
}

// quando a página abrir, busca o pet
onMounted(carregarPet);
</script>

<template>
  <div>
    <header class="mb-4">
      <h1 class="text-2xl font-bold">Detalhes do Pet</h1>
      <p class="text-body-secondary mb-0">
        Dados do pet cadastrado no sistema.
      </p>
    </header>

    <!-- só aparece enquanto tá carregando -->
    <p v-if="carregando">Carregando pet...</p>

    <!-- só aparece se deu erro ou se o pet não existe -->
    <div
      v-else-if="erro"
      class="alert alert-danger"
      role="alert"
    >
      {{ erro }}
    </div>

    <!-- só aparece se carregou e achou o pet -->
    <div
      v-else
      class="card col-md-6"
    >
      <div class="card-body">
        <dl class="row mb-0">
          <dt class="col-sm-4">ID</dt>
          <dd class="col-sm-8">{{ pet.id }}</dd>

          <dt class="col-sm-4">Nome</dt>
          <dd class="col-sm-8">{{ pet.nome }}</dd>

          <dt class="col-sm-4">Espécie</dt>
          <dd class="col-sm-8">{{ pet.especie }}</dd>

          <dt class="col-sm-4">Tutor</dt>
          <dd class="col-sm-8">
            {{ tutor ? tutor.nome : 'Tutor Não Encontrado!' }}
          </dd>

          <!-- o telefone só aparece se o tutor foi encontrado -->
          <template v-if="tutor">
            <dt class="col-sm-4">Telefone</dt>
            <dd class="col-sm-8">{{ tutor.telefone }}</dd>
          </template>
        </dl>
      </div>
    </div>

    <!-- botão pra voltar pra listagem -->
    <RouterLink
      class="btn btn-outline-secondary mt-3"
      to="/pets"
    >
      Voltar
    </RouterLink>
  </div>
</template>