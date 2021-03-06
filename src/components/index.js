import {
  Loading,
  MessageBox,
  Message
} from 'element-ui'
import HjDialog from './dialog'
import HjButton from './button'
import HjSelect from './select'
// import quillEditor from './quillEditor'


export default {
  install: (Vue) => {
    Vue.use(Loading)
    Vue.prototype.$msgbox = MessageBox;
    Vue.prototype.$message = Message;
    Vue.prototype.$alert = MessageBox.alert;
    Vue.prototype.$confirm = MessageBox.confirm;
    Vue.prototype.$prompt = MessageBox.prompt;
    // Vue.prototype.$notify = Notification;    //IE兼容
    Vue.component('hj-dialog', HjDialog)
    Vue.component('hj-button', HjButton)
    Vue.component('hj-select', HjSelect)
    // Vue.component('quill-editor', quillEditor)

  }
}