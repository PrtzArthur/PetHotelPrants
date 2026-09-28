<script setup>
// importa umas ferramentas do vue pra gente usar
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';

// o endereço de onde vem os dados (o json-server)
const API_URL = 'http://localhost:3000';

const pets = ref([]); // 'lugar' onde guardamos os pets (começa vazia)
const tutores = ref([]); // 'lugar' onde guardamos os tutores (começa vazia)
const carregando = ref(true); // true = ainda carregando, false = já carregou
const erro = ref(''); // guarda a mensagem de erro, se der ruim

/* 
  função que busca os pets lá na API.
  ela avisa que tá carregando, pede os dados,
  confere se deu certo e guarda na lista de pets.
  se der erro, ela mostra uma mensagem na tela.
*/
async function carregarPets() {
  carregando.value = true; // avisa que começou a carregar
  erro.value = ''; // limpa o erro de antes, se tinha

  // tenta fazer isso, se der erro pula pro catch
  try {
    // pede os pets pra API e espera a resposta chegar
    const resposta = await fetch(`${API_URL}/pets`);

    // se NÃO deu certo, joga um erro
    if (!resposta.ok) {
      throw new Error(`Erro ${resposta.status} ao buscar os pets.`);
    }

    // deu certo, então ele transforma a resposta em dados e guarda nos pets
    pets.value = await resposta.json();
  } catch (e) {
    console.error(e); // mostra o erro no console
    // guarda a mensagem que vai aparecer na tela
    erro.value =
      'Não foi possível carregar os pets. Verifique se a API está rodando.';
  } finally {
    // isso roda sempre, deu certo ou errado: tira o "carregando"
    carregando.value = false;
  }
}

/* 
  mesma coisa da função de cima,
  só que essa busca os tutores em vez dos pets
*/
async function carregarTutores() {
  try {
    // pede os tutores pra API
    const resposta = await fetch(`${API_URL}/tutores`);

    // confere se deu certo antes de converter
    if (!resposta.ok) {
      throw new Error(`Erro ${resposta.status} ao buscar os tutores.`);
    }

    tutores.value = await resposta.json(); // guarda os tutores na caixinha
  } catch (e) {
    console.error(e); // se der erro, só mostra no console
  }
}

/* 
  recebe o id do tutor e devolve o nome dele.
  se não achar ninguém com esse id, devolve um aviso.
*/
function nomeDoTutor(tutorId) {
  // olha um tutor de cada vez na lista
  for (const tutor of tutores.value) {
    // se o id for o mesmo, achou!
    if (tutor.id === tutorId) {
      return tutor.nome; // devolve o nome dele
    }
  }
  // se não achou ninguém, devolve esse aviso
  return 'Tutor Não Encontrado!';
}

// quando a página abrir, roda essas duas funções
onMounted(() => {
  carregarPets();
  carregarTutores();
});
</script>

<template>
  <div>
    <header class="mb-4">
      <h1 class="text-2xl font-bold">Listagem de Pets</h1>
      <p class="text-body-secondary mb-0">
        Listagem dos Pets cadastrados no sistema.
      </p>
    </header>

    <!-- botão que leva pra página de adicionar pet -->
    <RouterLink
      class="btn btn-primary"
      :to="{ name: 'addPet' }"
    >
      Adicionar Pet
    </RouterLink>

    <!-- só aparece enquanto tá carregando -->
    <p
      v-if="carregando"
      class="mt-3"
    >
      Carregando pets...
    </p>

    <!-- só aparece se deu erro -->
    <div
      v-else-if="erro"
      class="alert alert-danger mt-3"
      role="alert"
    >
      {{ erro }}
    </div>

    <!-- só aparece se carregou e não deu erro -->
    <table
      v-else
      class="table table-striped table-hover"
    >
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Especie</th>
          <th>Tutor</th>
        </tr>
      </thead>

      <tbody>
        <!-- faz uma linha da tabela pra cada pet -->
        <tr
          v-for="pet in pets"
          :key="pet.id"
        >
          <td>{{ pet.id }}</td>
          <td>{{ pet.nome }}</td>
          <td>{{ pet.especie }}</td>
          <!-- mostra o nome do tutor do pet -->
          <td>{{ nomeDoTutor(pet.tutorId) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>