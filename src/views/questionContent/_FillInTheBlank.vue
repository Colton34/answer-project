<template>
  <!-- 填空题 -->
  <div class="question-info">
    <template v-if="questionData.first && questionData.borderTop == undefined">
      <div class="question-title" :style="{height: data.heightTitle - 10 + 'px'}" v-if="!isEditor" @click="hanldeEditor">
        <div class="title-span" v-html="cotent"></div>
      </div>
      <quill-editor
        v-show="isEditor"
        :topic-content="TopicContent"
        @hanlde-close-esitor="hanldeCloseEsitor"
      />
    </template>
    <div class="question_arrays">
      <div class="question_editOrDel">
        <span
          class="layui-btn layui-btn-xs"
          @click="currentQuestionFillEdit(questionData.id)"
          >编辑</span
        >
        <span class="layui-btn layui-btn-xs" @click="delHanlde(questionData.id)"
          >删除</span
        >
      </div>
    </div>
    <drag-change-height
      :question="questionContetn"
      @height-resize="handleResize($event)"
      :min-height="minHeight"
    >
      <div class="content-info">
        <div class="content-row" v-for="(item, i) in topicGroupData" :key="i">
          <a
            v-for="row in item"
            :key="row.id"
            :style="{ width: pageWidth / data.rows + 'px' }"
          >
            <i v-if="row.lgTopic != undefined" ref="iWidth">
              <template v-if="row.lgTopic < 2">{{ row.topic }}</template>
              <template v-if="row.lgTopic != 0">({{ row.lgTopic }})</template>
            </i>
            <i v-else ref="iWidth"></i>
            <span
              v-if="row.lgTopic != undefined"
              :style="{
                width:
                  row.lgTopic != 0
                    ? 'calc(100% - ' +
                      (row.topic.toString().length +
                        row.lgTopic.toString().length +
                        2) *
                        9 +
                      'px)'
                    : 'calc(100% - 23px)',
              }"
            />
            <span
              v-else
              :style="{
                width: 'calc(100% - 22px)',
              }"
            />
          </a>
        </div>
      </div>
    </drag-change-height>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import quillEditor from '../../components/quillEditor'
import dragChangeHeight from '../questionContent/drag'
export default {
  components: {
    quillEditor,
    dragChangeHeight
  },
  props: {
    contentData: {
      type: Object,
      default: () => {},
    },
    questionData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      data: {},
      isEditor: false,
      cotent: '',
      options:[],
    }
  },
  computed: {
    ...mapState('questionType', ['questionNumber', 'letterArr']),
    ...mapState('pageContent', ['pageData', 'pageLayout']),
    heightContetn(){
      const {castHeight,heightTitle,height} = this.questionData
      let obj = {
        height: castHeight >= height  ? castHeight - heightTitle - 3 : castHeight
      }
      return obj
    },

    minHeight(){
      const {rowHeight, showData,MarginHeight,height,castHeight} = this.questionData
      return  castHeight >= height ? rowHeight * showData.length + MarginHeight - 3 : 0
    },

    TopicContent() {
      const {number,topic,totalScore} = this.data
      return `<span>${this.options[number].label}.</span><span>${topic}</span><span>(${totalScore})分</span>`
    },
    pageWidth() {
      return this.pageLayout.column === 3 && this.pageLayout.size == 'A3'
        ? 440
        : 695
    },
    topicGroupData() {
      return this.questionData.showData
    },
    topicBox() {
      let topicList = []
      this.data.group.forEach((item) => {
        topicList.push(...item.childGroup)
      })
      return topicList
    },
  },
  watch: {
    contentData: {
      immediate: true,
      handler() {
        this.data = {
          ...this.contentData,
        }
        this.options = this.questionNumber.map((label,value)=>({label,value}))
      },
    },
    TopicContent: {
      immediate: true,
      handler() {
        this.cotent = this.TopicContent
      },
    },
    heightContetn:{
      immediate: true,
      handler() {
        this.questionContetn = this.heightContetn
      },
    }
  },
  methods: {
    ...mapMutations('pageContent', [
      'delPageData',
      'del_objectiveData',
      'del_orderSort',
      'amendPageData',
    ]),
    ...mapMutations('questionType', [
      'del_AlreadyTopics',
      'set_currentQuestion',
      'del_determineTopic',
      'del_existBigQuestion',
    ]),
    delHanlde(id) {
      // 删除大题-小题数
      const index = this.pageData.findIndex((itme) => itme.id === id)
      if (index > -1) {
        this.del_determineTopic(this.topicBox)
        this.del_AlreadyTopics(this.topicBox)
        this.del_orderSort(this.pageData[index].order + 1)
        this.delPageData(index)
        this.set_currentQuestion()
        this.del_objectiveData() // 删减一个大题号
        this.del_existBigQuestion(this.questionData)
      }
    },
    currentQuestionFillEdit(id) {
      this.$emit('current-question-fill-edit', id)
    },
    hanldeEditor() {
      this.isEditor = true
    },
    hanldeCloseEsitor(content) {
      this.isEditor = false
      this.cotent = content
    },
    handleResize (rectHeight) {

      const {castHeight,height} = this.questionData
      let crrHeight = rectHeight

      const index = this.pageData.findIndex(obj => this.questionData.id === obj.id)
      if(index > -1){
        let questionObj = this.pageData[index]
        if(castHeight < height){
          crrHeight = (height - castHeight) + rectHeight
        }
        this.amendPageData({
            ...questionObj,
            height:crrHeight >= this.minHeight ? crrHeight + questionObj.heightTitle + 3:this.minHeight,
          })

      }

    }
  },
}
</script>

<style lang="less">
@import '~@/assets/css/variables.less';
.question-title {
  margin-bottom: 10px;
  span {
    color: @font-333;
  }
}
.question-info{
  &:hover{
    .question_arrays{
      display: block;
    }
  }
}
.question_arrays {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  display: none;

  .question_editOrDel {
    position: absolute;
    right: 0;
    top: -10px;
    // display: block;
    z-index: 99;
    span {
      margin-left: 10px;
    }
  }
  .question-title img {
    max-width: 100%;
  }
  .question-title>div {
    padding: 10px 0 10px 10px;
    border: 1px solid #fff;
    p{margin: 0 0}
}
  .question-title:hover{
    div{border-color: @main}
  }
}
.content-info{
  // border:1px solid @font-888;
  padding-bottom: 15px;
}
.content-row  {
  a{
    display: inline-block;
    height: 30px;
    margin-left: 5px;
    width: 100%;
    i{
      display: inline-block;
      min-width: 22px;
      font-size: 12px;
      font-style: normal;
      text-align: center;
    }
    span{
      display: inline-block;
      height: 30px;
      width: 80px;
      top: 3px;
      position: relative;
      border-bottom: 1px solid #888;
      width: calc(100% - 22px)
    }
  }
  margin-bottom: 10px;
}
</style>
