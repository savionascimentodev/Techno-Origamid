const vm = new Vue({
  el: "#app",
  data: {
    products: [],
    product: false,
    car: [],
    carActive: false,
    messageAlert: 'Item adicionado com sucesso',
    alertActive: false
  },
  filters: {
    numberPrice(value) {
      return value.toLocaleString("pt-br", { style: "currency", currency: "BRL" })
    },
  },
  computed: {
    carTotal() {
      let total = 0

      if (this.car.length) {
        this.car.forEach(item => {
          total += item.price
        })
      }

      return total
    }
  },
  watch: {
    product() {
      document.title = this.product.name || 'Techno'
      const hash = this.product.id || ''
      history.pushState(null, null, `#${hash}`) // Criando uma rota com o Id dos produtos
      if (this.product) {
        this.compareInventory()
      } // Caso tenha algum produto ele compara o estoque
    },
    car() {
      window.localStorage.car = JSON.stringify(this.car) // Deixando salvo no local storage e transformando em string com stringfy
    }
  },
  methods: {
    fetchProducts() {
      fetch("./api/products.json")
        .then(r => r.json())
        .then(r => {
          this.products = r
        })
    },
    fetchProduct(id) {
      fetch(`./api/products/${id}/data.json`)
        .then(r => r.json())
        .then(r => {
          this.product = r
        })
    },
    openModal(id) {
      this.fetchProduct(id)
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      })
    },
    closeModal({ target, currentTarget }) {
      if (target === currentTarget) this.product = false
    },
    closeCarModal({ target, currentTarget }) {
      if (target === currentTarget) this.carActive = false
    },
    addItem() {
      this.product.inventory--
      const { id, name, price } = this.product
      this.car.push({ id, name, price })
      this.alert(`${name} adicionado ao carrinho.`) // Chamando o alert e passando cada nome de produto reativamente
    },
    removeItem(index) {
      this.car.splice(index, 1)
    },
    checkLocalStorage() {
      if (window.localStorage.car) {
        this.car = JSON.parse(window.localStorage.car) // Transformando de volta em array
      }
    },
    compareInventory() {
      const items = this.car.filter(({ id }) => id === this.product.id)
      this.product.inventory -= items.length
    },
    alert(message) {
      this.messageAlert = message
      this.alertActive = true
      setTimeout(() => {
        this.alertActive = false
      }, 1500) // Quanto tempo o alerta vai ficar na tela
    },
    router() {
      const hash = document.location.hash // Da o hash que está na barra
      if (hash) {
        this.fetchProduct(hash.replace("#", "")) // Trocando o jogo da velha por nada
      }
    }
  },
  created() {
    this.fetchProducts()
    this.router()
    this.checkLocalStorage()
  }
});