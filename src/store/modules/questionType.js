const state = {
  questionNumber: ['一','二','三','四','五','六','七','八','九','十','十一','十二','十三','十四','十五',
  '十六','十七','十八','十九','二十','二十一','二十二','二十三','二十四'],
  AlreadyTopics: [], // 已有的题组
  currentQuestion: 1,
  letterArr: ['A', 'B', 'C', 'D', 'E', 'G', 'H', 'I', 'J', 'K'],
  maxTopic: 200, // 最大题数
  determineTopic: [], // 确定下的小题
  existBigQuestion: [], // 存在大题
}

const mutations = {
  del_AlreadyTopics(state, Arr) {
    if (Arr == undefined) {
      return false
    }
    // 删除已有小题数组
    Arr.forEach((item) => {
      const index = state.AlreadyTopics.findIndex(
        (row) => row.topic === item.topic
      )
      if (index > -1) {
        state.AlreadyTopics.splice(index, 1)
      }
    })
  },

  Add_AlreadyTopics(state, Arr) {
    if (Arr == undefined) {
      return false
    }
    //新增小题数组
    Arr.forEach((item) => {
      if (state.AlreadyTopics.length > 0) {
        const index = state.AlreadyTopics.findIndex(
          (row) => row.topic === item.topic
        )
        if (index > -1) {
          state.AlreadyTopics.splice(index, 1, item)
        } else {
          state.AlreadyTopics.push(item)
        }
      } else {
        state.AlreadyTopics.push(item)
      }
    })
  },

  once_AlreadyTopics: (state, id) => {
    // 一次清除
    state.AlreadyTopics = state.AlreadyTopics.filter((item) => {
      return ![id].includes(item.id)
    })
  },

  Fullin_once_AlreadyTopics: (state, pid) => {
    // 解答一次清除
    state.AlreadyTopics = state.AlreadyTopics.filter((item) => {
      return ![pid].includes(item.pid)
    })
  },

  set_AlreadyTopics: (state, Arr) => {
    if (Arr == undefined) {
      return false
    }
    Arr.forEach((item) => {
      const index = state.AlreadyTopics.findIndex(
        (row) => row.topic == item.topic
      )
      if (index > -1) {
        state.AlreadyTopics.splice(index, 1, item)
      }
    })
  },

  Empty_AlreadyTopics: (state) => {
    // 清空数据
    state.AlreadyTopics = []
  },

  set_currentQuestion: (state) => {
    for (let i = 1; i < state.maxTopic; i++) {
      //
      const index = state.AlreadyTopics.findIndex((item) => item.topic === i)
      if (index <= -1) {
        state.currentQuestion = i
        break
      } else {
        state.currentQuestion = 1
      }
    }
  },

  set_determineTopic: (state, Arr) => {
    if (Arr == undefined) {
      return false
    }
    // 添加确定值
    Arr.forEach((item) => {
      const index = state.determineTopic.findIndex(
        (row) => row.topic === item.topic
      )
      if (index > -1) {
        state.determineTopic.splice(index, 1, item)
      } else {
        state.determineTopic.push(item)
      }
    })
  },

  delOnce_determineTopic: (state, pid) => {
    // 一次清除相同pid
    state.determineTopic = state.determineTopic.filter((item) => {
      return ![pid].includes(item.pid)
    })
  },

  del_determineTopic: (state, Arr) => {
    if (Arr == undefined) {
      return false
    }
    Arr.forEach((item) => {
      const index = state.determineTopic.findIndex(
        (row) => row.topic === item.topic
      )
      if (index > -1) {
        state.determineTopic.splice(index, 1)
      }
    })
  },
  // 存在大题
  set_existBigQuestion: (state, obj) => {
    const index = state.existBigQuestion.findIndex(
      (row) => row.id === obj.id
    )
    if (index > -1) {
      state.determineTopic.splice(index, 1, obj)
    } else {
      state.existBigQuestion.push(obj)
    }
  },

  insert_existBigQuestion: (state, {
    obj,
    num,
    order,
    SelfO0rder
  }) => {
    state.existBigQuestion.map(function (item) {
      return {
        ...item,
        order: item.order >= order ? item.order + 1 : item.order,
      }
    });
    setTimeout(function () {
      state.existBigQuestion.splice(num, 0, obj);
      state.existBigQuestion = state.existBigQuestion.sort(function (a, b) {
        return a.order - b.order;
      });
      if (SelfO0rder) {
        state.existBigQuestion.forEach((item, index) => {
          state.existBigQuestion.splice(index, 1, {
            ...item,
            label: state.options[index].label + '.' + item.label.split('.')[1]
          })
        })
      }
    }, 50);
  },

  del_existBigQuestion: (state, obj) => {
    let id = obj.objId != undefined ? obj.objId : obj.id
    const index = state.existBigQuestion.findIndex(
      (row) => row.id === id
    )
    if (index > -1) {
      state.existBigQuestion.splice(index, 1)
    }
  },

}

const actions = {}

const getters = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}