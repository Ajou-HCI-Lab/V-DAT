<template>
  <div>
    <header>
      <NavBar />
    </header>
    <body class="content-wrapper">
      <section>
        <section class="e4_band">
          <div class="container">
            <div class="e4_band_connect">
              <div class="header">
                <div class="e4_header">
                  <h1 class="title">
                    E4 Band 설정
                    <span class="icon">
                      <b-icon icon="chevron-right"></b-icon>
                    </span>
                  </h1>
                  <p>E4 Band와 서버 간의 통신을 관리할 수 있습니다!!!</p>
                </div>
              </div>
              <div class="horizontalLine"></div>
              <section>
                <!-- <h1 class="title"> -->
                <!-- E4 밴드의 이름, 서버 ip주소, 포트 번호를 입력 받는 부분 입니다(임시) -->
                <!-- </h1> -->
                <div class="sub-parts">
                  <h3 class="sub-title">
                    E4 band name
                  </h3>
                  <b-form-input v-model="deviceId" placeholder="Please input E4 band Name"></b-form-input>
                  {{ deviceId }}
                </div>
                <div class="sub-parts">
                  <h3 class="sub-title">
                    Server IP address
                  </h3>
                  <b-form-input v-model="serverIp" placeholder="Please input E4 server IP"></b-form-input>
                  {{ serverIp }}
                </div>
                <div class="sub-parts">
                  <h3 class="sub-title">
                    Port number
                  </h3>
                  <b-form-input v-model="e4Port" placeholder="Please input E4 port number"></b-form-input>
                </div>
                <div class="btn_contents">
                  <h1 class="title">Select sensor data</h1>
                  <div class="button">
                    <span v-for="sensor in sensors" :key="sensor.name" class="btn">
                      <!-- <b-button squared :pressed.sync="sensor.state" variant="primary">{{ sensor.name }}</b-button> -->
                      <b-form-checkbox v-model="sensor.state">{{ sensor.name }}</b-form-checkbox>
                    </span>
                  </div>
                </div>
                <div class="btn_contents">
                  <div class="button">
                    <span class="btn">
                      <b-button v-on:click="connectStart" size="" variant="dark">연결 시작</b-button>
                    </span>
                    <span class="btn">
                      <b-button v-on:click="connectEnd" size="" variant="dark">연결 종료</b-button>
                    </span>
                  </div>
                </div>
              </section>
              <div class="horizontalLine"></div>
              <section>
                <div class="header">
                  <div class="e4_header">
                    <h1 class="title">
                      HMD, Eye Tracker 설정
                      <span class="icon">
                        <b-icon icon="chevron-right"></b-icon>
                      </span>
                    </h1>
                    <p>Unity와의 연결을 control할 수 있습니다!!!</p>
                  </div>
                </div>
                <div class="btn_contents">
                  <div class="button">
                    <span class="btn">
                      <b-button variant="dark">연결 시작</b-button>
                    </span>
                    <span class="btn">
                      <b-button variant="dark">연결 종료</b-button>
                    </span>
                  </div>
                </div>
              </section>
              <div class="horizontalLine"></div>
            </div>
          </div>
        </section>
        <section class="download">
          <div class="down-btn">
            <b-button variant="dark" size="lg" @click="downloadData"> CSV FIle 다운 로드</b-button>
          </div>
        </section>
      </section>
    </body>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar";

export default {
  name: "Main",
  components: { NavBar },
  data() {
    return {
      state: false,
      deviceId: "",
      serverIp: "",
      e4Port: null,
      sensors: [
        { name: "E4 ACC", state: false },
        { name: "E4 BVP", state: false },
        { name: "E4 TEMP", state: false },
        { name: "E4 GSR", state: false },
        { name: "E4 IBI", state: false },
      ],
    };
  },
  computed: {},
  methods: {
    downloadData() {
      this.$http
        .post("/main/getData", {
          headers: { responseType: "blob" },
          state: "hello",
        })
        .then((result) => {
          const url = window.URL.createObjectURL(new Blob([result.data]));
          const link = document.createElement("a");
          const contentDisposition = result.headers["content-disposition"]; // 파일 이름
          let fileName = "unknown";
          if (contentDisposition) {
            const [fileNameMatch] = contentDisposition.split(";").filter((str) => str.includes("filename"));
            if (fileNameMatch) [, fileName] = fileNameMatch.split("=");
          }
          link.href = url;
          link.setAttribute("download", `${fileName}`);
          link.style.cssText = "display:none";
          document.body.appendChild(link);
          link.click();
          link.remove();
        });
    },
    connectStart: function() {
      let temp = new Array();
      this.sensors.forEach((element, index) => {
        if (element.state == true) {
          temp.push(index);
        }
      });

      this.$http
        .post("/connect/start", {
          state: !this.connection,
          deviceId: this.deviceId,
          serverIp: this.serverIp,
          e4Port: this.e4Port,
          sensor: temp,
        })
        .then((result) => {
          console.log(result.data);
        });
    },
    connectEnd: function() {
      this.$http
        .post("/connect/end", {
          state: this.connection,
        })
        .then((result) => {
          console.log(result.data);
        });
    },
  },
  beforeMount() {},
};
</script>

<style>
.verticalLine {
  border-left: 1px solid darkgrey;
}

h1,
h3 {
  margin: 0;
}

p {
  margin: 0;
  margin-top: 4px;
}

.content-wrapper {
  height: 110vh;
  background-color: #f2f2f2;
}

.e4_band {
  padding-top: 24px;
  padding-bottom: 24px;
  padding-right: 50px;
  padding-left: 50px;
}

.download {
  padding-top: 24px;
  padding-bottom: 24px;
  padding-left: 50px;
  padding-right: 50px;
}

.down-btn {
  display: flex;
  justify-content: center;
}

.container {
  flex-grow: 1;
  margin: 0 auto;
  position: relative;
  width: auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: #f2d6a2;
  border-radius: 10px;
  padding: 10px;
}

.title {
  font-size: 2rem;
  line-height: 1.5;
  font-weight: 700;
}

.sub-parts {
  margin-top: 10px;
  margin-bottom: 10px;
}

.sub-title {
  margin-bottom: 5px;
  font-size: 1rem;
}

.button {
  /* border: solid; */
  display: flex;
  padding: 6px 0;
  justify-content: center;
}
.icon {
  box-sizing: content-box;
  font-size: inherit;
  width: 1rem;
  height: 1rem;
  line-height: 1;
}
.horizontalLine {
  border-bottom: 1px solid black;
}
</style>
