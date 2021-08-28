<template>
  <div>
    <NavBar/>
    <div class="contents-wrapper">
      <div class="player-part">
        <Player ref="videoPlayer" v-if="fetched" :controlledTime="timeChanged" @timeSync="timeSync" :videoUrl="videoUrl"
                @gotTotalTime="gotTotalTime"/>
      </div>
      <div class="verticalLine"></div>
      <div class="contents-part">
        <div class="accordion" role="tablist">
          <b-card v-for="(value,index) in menuList" no-body class="mb-1">
            <b-card-header header-tag="header" class="p-1 arcodian-header" role="tab">
              <div class="header-left">
                <b-icon variant="warning" class="header-icon" :icon="value.icon"></b-icon>
                <div class="header-text">
                  <span class="header-title">{{ value.title }}</span>
                  <span class="header-subtitle">{{ value.subTitle }}</span>
                </div>
              </div>
              <div class="header-right">
                <div class="verticalLine header-hairline"></div>
                <b-button v-b-toggle="idCalculated(index)" variant="info">다시 보기</b-button>
              </div>
            </b-card-header>
            <b-collapse :id="idCalculated(index)" visible accordion="my-accordion" role="tabpanel">
              <b-card-body>
                <b-card-text>{{ value.contents }}</b-card-text>
                <line-chart v-if="fetched" :raw="timeline"/>

                <b-form-input id="range-1" @mousedown="pause" @mouseup="mouseUp" v-model="controlledTime" type="range"
                              min="0"
                              :max="maxTime"></b-form-input>
                <div class="mt-2">시간: {{ parseInt(controlledTime) }}</div>
              </b-card-body>
            </b-collapse>
          </b-card>
        </div>


      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar";
import Player from "@/components/Player";
import Graph from "@/components/Graph";
import LineChart from "@/components/LineChart";

export default {
  name: "Main",
  components: {LineChart, Graph, Player, NavBar},
  data() {
    return {
      videoUrl: 'https://dt1amnyxy57si.cloudfront.net/videos/노태형_2.mp4',
      fetched: true,
      controlledTime: 0,
      maxTime: null,
      changedTime: null,
      timeline: null,
      menuList: [{
        icon: 'play-circle-fill',
        title: '타이틀입니다',
        subTitle: '서브타이틀입니다',
        contents: '내용'
      },
        {
          icon: 'play-circle-fill',
          title: '타이틀입니다2',
          subTitle: '서브타이틀입니다',
          contents: '내용'
        }, {
          icon: 'play-circle-fill',
          title: '타이틀입니다3',
          subTitle: '서브타이틀입니다',
          contents: '내용'
        }, {
          icon: 'play-circle-fill',
          title: '타이틀입니다4',
          subTitle: '서브타이틀입니다',
          contents: '내용'
        }
      ]
    }
  },
  computed: {
    timeChanged() {
      return this.changedTime
    },

  },
  methods: {
    idCalculated(index) {
      return `arcodion-${index}`
    },
    gotTotalTime(time) {
      this.maxTime = time
    },
    timeSync(time) {
      this.controlledTime = time
    },
    mouseUp(e) {
      this.changedTime = parseInt(e.target.value)
      this.$refs.videoPlayer.player.play()

    },
    pause() {

      this.$refs.videoPlayer.player.pause()


    }
  },
  beforeMount() {
    this.$http.post('/main/getData')
        .then(res => {
          this.videoUrl = res.data[0][0].url
          this.timeline = res.data[1]
          console.log(res.data)


          this.fetched = true

        })

  }
}
</script>

<style scoped>
.verticalLine {
  border-left: 1px solid darkgrey;

}

.contents-wrapper {
  display: flex;
  justify-content: space-around;
  height: 100vh;
}

.player-part {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  padding: 0px 3rem;
}

.contents-part {
  width: 50%;
  padding: 0px 3rem;
  padding: 2rem;

}

.arcodian-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 5rem;
  background-color: white;
  padding: 0 1rem !important;
}

.header-text {
  display: flex;
  flex-direction: column
}

.header-title {
  font-size: 1.1rem;
  font-weight: bold;
}

.header-subtitle {

}

.header-icon {
  height: 80%;
  width: auto;
  margin-right: 1rem;
}

.header-hairline {
  height: 80%;
  float: right;
  margin-right: 1rem;

}

.header-left {
  display: flex;
  height: 100%;
  align-items: center;
}

.header-right {
  display: flex;
  height: 100%;
  align-items: center;
}
</style>
