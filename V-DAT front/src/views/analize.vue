<template>
  <div>
    <header>
      <NavBar />
    </header>
    <body>
      <section>
        <section id="title-parts">
          <div class="title-header">
            <h1 class="title">
              센서 값 선택
            </h1>

            <div class="horizontalLine"></div>
          </div>
        </section>
        <section id="button-parts">
          <div class="button">
            <b-button class="btn">ACC</b-button>
          </div>
        </section>
      </section>
      <section></section>
    </body>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar";

export default {
  name: "Anal",
  components: { NavBar },
};
</script>

<style scoped>
.horizontalLine {
  border-bottom: 1px solid black;
}

#title-parts {
  border: solid;
}

#button-parts {
  border: solid;
}
</style>
