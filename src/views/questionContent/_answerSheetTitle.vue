<template>
  <div>
    <div class="textVal-style" v-if="previewIs">
      {{ textVal == '' ? '请输入答题卡标题' : textVal }}
    </div>
    <hj-textarea v-else :textarea-data="textVal" />
    <student-info @hanldeStudent="hanldeStudent" :preview-is="previewIs" />
    <el-row class="precautions_box">
      <el-col
        :span="12"
        class="precautions_left"
        :style="{ width: titleWidthLeft + 'px' }"
      >
        <div class="precautions_title">注 意 事 项</div>
        <div :class="['precautions_content', { active: rectWidth == 480 }]">
          <div>1. 答题前请将姓名、班级、考场、座号和准考证号填写清楚。</div>
          <div>2. 客观题答题,必须使用2B铅笔填涂,修改时用橡皮擦干净。</div>
          <div>3. 主观题必须使用黑色签字笔书写。</div>
          <div>4. 必须在题号对应的答题区域内作答,超出答题区域书写无效。</div>
          <div>5. 保持答卷清洁完整。</div>
        </div>
        <div class="precautions_mark">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            version="1.1"
          >
            <text x="10" y="30" :style="{fontSize: !svg ? 18 + 'px' : 16 + 'px'}">正确填涂</text>
            <rect
              :x="!svg ? 110:80"
              y="19"
              width="17"
              height="10"
              stroke="#000000"
              fill="#000000"
              style="fill-opacity: 1"
            />
            <text
              :x="!svg ? 175 : 120"
              y="30"
              :style="{fontSize: !svg ? 18 + 'px' : 16 + 'px'}">缺考标记</text>
            <rect
              :x="!svg ? 278 : 190"
              y="19"
              width="17"
              height="10"
              stroke="#000000"
              style="fill-opacity: 0"
            />
          </svg>
        </div>
      </el-col>
      <el-col
        :span="12"
        class="precautions_right"
        :style="{ width: titleWidthRight + 'px' }"
      >
        <div class="ticket_number">
          准考证号
          <span
            v-show="!previewIs"
            class="precautions_edit layui-btn layui-btn-xs"
            @click="editAdmissionNumber"
            >编辑</span
          >
        </div>
        <table class="table_box" cellspacing="0" cellpadding="0">
          <tbody>
            <tr>
              <th v-for="(item, i) in titleRows" :key="i" />
            </tr>
            <tr>
              <td v-for="(item, i) in titleRows" :key="i">
                <div
                  v-for="row in trDiv"
                  :key="row"
                  :style="{ minWidth: divWidth + 'px' }"
                >
                  [<span>{{ row }} </span>]
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import hjTextarea from './Precautions/_textarea'
import studentInfo from './Precautions/_studentInfo'
export default {
  components: {
    hjTextarea,
    studentInfo,
  },
  props: {
    contentData: {
      type: Object,
      default() {
        return []
      },
    },
    previewIs: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      trDiv: 9,
      studentInfoList: [],
    }
  },
  computed: {
    ...mapState('titleSet', ['textVal', 'titleInfo', 'titleRows']),
    ...mapGetters('pageContent', ['dataLayout']),

    cardData() {
      return this.contentData[0]
    },
    rectWidth() {
      return this.dataLayout.column === 3 && this.dataLayout.size == 'A3'
        ? 480
        : 745
    },
    Rows() {
      return this.titleRows == 9 && this.rectWidth == 480 ? 26 : 28
    },
    svg() {
      return this.rectWidth == 480 ? true : false
    },
    titleWidthLeft() {
      if (this.titleRows * this.Rows < 224) {
        return this.rectWidth - 224
      } else {
        return this.rectWidth - this.titleRows * this.Rows
      }
    },
    titleWidthRight() {
      if (this.titleRows * this.Rows < 224) {
        return 224
      } else {
        return this.rectWidth - this.titleWidthLeft
      }
    },
    divWidth() {
      return this.titleWidthRight == 224
        ? 224 / this.titleRows - 1
        : this.Rows - 1
    },
  },
  mounted() {},
  methods: {
    hanldeStudent(Arr) {
      this.$emit('hanldeStudent', Arr)
    },
    editAdmissionNumber() {
      this.$emit('edit-admission-number')
    },
    hanldeCloseEsitor(){
    }
  },
}
</script>

<style lang="less">
@import '~@/assets/css/variables.less';
.title-item {
  height: 40px;
  line-height: 50px;
  min-width: 148px;
  position: relative;
  top: 8px;
  span {
    display: inline-block;
    font-size: 18px;
  }
  > span:last-child {
    width: 87px;
    position: relative;
    margin-left: 10px;
    margin-right: 15px;
    top: 3px;
    border-bottom: 2px solid @font-888;
  }
  span.titke-edit {
    position: absolute;
    top: -26px;
    right: 0;
    font-size: 12px !important;
    height: 20px;
    line-height: 20px;
    padding: 0 6px;
    border-radius: 3px;
    color: @white;
    cursor: pointer;
    background-color: @main;
  }
}

.precautions_box {
  margin-top: 15px;
  .precautions_title {
    height: 38px;
    line-height: 38px;
    border-bottom: 2px solid @font-888;
    text-align: center;
    width: 100%;
  }
  .precautions_left {
    border: 1px solid @font-888;
    height: 258px;
  }
  .precautions_right {
    border: 1px solid @font-888;
    min-width: 223px;
    border-left: none;
    height: 258px;
  }
  .precautions_content {
    padding-left: 10px;
    min-height: 127px;
    border-bottom: 1px solid @font-333;
    font-size: 14px;
    &.active {
      div {
        padding: 1px 0;
      }
    }
  }
}
.precautions_left.columns .precautions_content {
  height: 141px;
  font-size: 12px;
  margin-top: 5px;
}
.precautions_title,
.ticket_number {
  height: 38px;
  line-height: 38px;
  border-bottom: 2px solid @font-888;
  text-align: center;
  width: 100%;
}
.layui-btn-xs {
  height: 22px;
  line-height: 22px;
  padding: 0 5px;
  font-size: 12px;
  display: inline-block;
  background-color: @main;
  color: @white;
  white-space: nowrap;
  text-align: center;
  border: none;
  border-radius: 2px;
  cursor: pointer;
}
.precautions_content div {
  padding: 7px 0;
  margin: 0 0;
}
.precautions_edit {
  position: absolute;
  right: 15px;
  top: 8px;
}
.precautions_mark {
  font-size: 16px;
  height: 50px;
  line-height: 50px;
}
.el-textarea__inner {
  border-style: dashed;
  padding: 0 0;
  text-align: center;
  line-height: 31px;
  font-size: 23px;
  border-color: @font-888;
  color: @font-666;
}
table tr td div:last-child {
  margin-bottom: 6px;
}

.table_box th {
  height: 28px;
}

.table_box div {
  font-size: 12px;
  text-align: center;
  padding-top: 4px;
  min-width: 27px;
  height: 16px;
}

.table_box div span {
  position: relative;
  top: 1px;
  left: 1.8px;
}

.table_box tr th {
  border-bottom: 2px solid @font-888;
}

.table_box td,
.table_box th {
  border-left: 1px solid @font-333;
}

.table_box td:first-child,
.table_box th:first-child {
  border-left: none;
}
.el-input--medium {
  font-size: 23px !important;
}
.el-textarea__inner {
  padding: 0 0 !important;
  border-style: dashed !important;
  border-color: @font-888 !important;
  height: 65px;
}
.table_box td:first-child {
  height: 186px;
}
.textVal-style {
  text-align: center;
  font-size: 22px;
  font-weight: bold;
  height: 65px;
  line-height: 65px;
}
</style>
