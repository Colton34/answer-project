<template>
  <div class="question-info">
    <template v-if="data.first && data.borderTop == undefined">
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
        <span class="layui-btn layui-btn-xs" @click="compositionEnglishEdit">编辑</span>
        <span class="layui-btn layui-btn-xs" @click="delHanlde">删除</span>
      </div>
    </div>
    <div class="answer_question_box composition_box">

      <div
        v-for="(item,i) in rowsData"
        :key="i"
        class="compositionEnglish_item"
      >
      <template  v-if="data.first && data.borderTop == undefined">
        <span
        v-if="i == 0"
        class="pre-t5"
        :style="{'width':strLong + 'px'}">{{contentData.topic}}.</span>
        <span
          class="line-style"
          :style="{'width':'calc(100% - '+ strLong +'px)'}"
        />
      </template>
      <template v-else>
        <span class="line-style" style="width:100%"/>
      </template>
      </div>
    </div>

  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import quillEditor from '../../components/quillEditor'
export default {
  components: {
    quillEditor,
  },
  props: {
    questionData: {
      type: Object,
      default: () => { }
    },
    contentData: {
      type: Object,
      default: () => { }
    },

  },
  data () {
    return {
      isEditor: false,
      data: {},
      cotent: '',
      options:[]
    }
  },
  computed: {
    ...mapState('questionType', ['questionNumber', 'letterArr']),
    ...mapState('pageContent', ['pageData', 'pageLayout']),
    strLong () {

      let long = this.contentData.topic.toString().length
      return parseInt(long) * 8 + 1
    },
    TopicContent () {
      const {name,number,score} = this.contentData
      return `<span>${this.options[number].label}.</span><span>${name}</span><span class='p-5'>(${score})</span>分`
    },
    topicData () {
      return ''
    },
    rowsData () {
      const { heightTitle, MarginHeight, castHeight, first, borderTop } = this.data
      let row = 0
      if (first && borderTop == undefined) {
        row = Math.floor((castHeight - MarginHeight - heightTitle) / 35)
      } else {
        row = Math.floor(castHeight / 35)
      }
      // console.log(row)
      let Arr = []
      for (let i = 1; i <= row; i++) {
        Arr.push(i)
      }
      return Arr
    }
  },
  watch: {
    questionData: {
      immediate: true,
      handler () {
        this.data = {
          ...this.questionData
        }
        this.options = this.questionNumber.map((label,value)=>({label,value}))
      }
    },
    TopicContent: {
      immediate: true,
      handler () {
        this.cotent = this.TopicContent
      }
    }
  },

  methods: {
    ...mapMutations('pageContent', [
      'delPageData',
      'Empty_PageData',
      'del_objectiveData',
      'del_orderSort',
    ]),
    ...mapMutations('questionType', [
      'del_AlreadyTopics',
      'set_currentQuestion',
      'del_determineTopic',
      'del_existBigQuestion',
    ]),
    hanldeCloseEsitor (content) {
      this.isEditor = false
      this.cotent = content
    },
    hanldeEditor () {
      this.isEditor = true
    },
    compositionEnglishEdit () {
      this.$emit('composition-english-edit', this.data)
    },
    delHanlde () { // 删除大题-小题数
      const index = this.pageData.findIndex((itme) => itme.id === this.data.id)
      if (index > -1) {
        this.del_determineTopic([this.contentData])
        this.del_AlreadyTopics([this.contentData])
        this.del_orderSort(this.pageData[index].order + 1)
        this.Empty_PageData(this.data.id)
        this.set_currentQuestion()
        this.del_objectiveData() // 删减一个大题号
        this.del_existBigQuestion(this.questionData)
      }

    },
  },
}
</script>


<style lang="less" >
.answer_question_box {
  &.composition_box {
    border-top: 1px solid #888;
    padding-bottom: 5px;
  }
}
.compositionEnglish_item {
  width: 100%;
  height: 35px;
  display: flex;
  span {
    display: inline-block;
  }
  .pre-t5 {
    position: relative;
    top: 18px;
    font-size: 12px;
  }
  .line-style {
    height: 34px;
    border-bottom: 1px solid #888;
    flex-basis: auto;
  }
}
</style>
<style lang="less" scoped>
  .composition_box{
    border: 1px solid #888;
  }
</style>
