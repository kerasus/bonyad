<template>
  <v-container fluid>
    <v-row align="center">
      <v-col
        class="d-flex"
        cols="12"
        sm="6"
      >
        <v-text-field
          v-model="title"
          label="موضوع پیام"
          outlined
        />
      </v-col>
      <v-col
        class="d-flex"
        cols="12"
        sm="6"
      >
        <v-select
          :items="messageType"
          label="نوع پیام"
        ></v-select>
      </v-col>
      <v-col
        cols="12"
        md="12"
      >
        <v-textarea
          solo
          name="input-7-4"
          label="پیام مشاور"
          v-model="description"
        ></v-textarea>
      </v-col>
      <v-col
        cols="12"
        md="12"
      >
        <v-btn
          @click="createMessage"
        >
          ثبت پبام
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  name: "liveDescriptionCreate",
  data() {
    return {
      messageType: ['A', 'B', 'C'],
      title: '',
      description:null,
    }
  },
  methods:{
    createMessage(){
      this.$axios.post('alaa/api/v2/livedescription',{
        title:this.title,
        description:this.description,
        owner:2,
        entity_id:347,
        entity_type:'App\Product'
      })
        .then(resp=>{
          console.log(resp)
          this.$router.push({path:'/admin/liveDescription/list'})
        })
        .catch(err=>{
          console.log(err)
        })
    }
  }
}
</script>

<style scoped>

</style>
