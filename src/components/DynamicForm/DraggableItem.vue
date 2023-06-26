/** *Copyright: Copyright (c) 2020 *Author:JakHuang *Version 1.0 *Title: form-generator/Element UI表单设计及代码生成器 *GitHub:
https://github.com/JakHuang/form-generator */
<script>
import draggable from 'vuedraggable'
import render from './components/render'

const components = {
  itemBtns(h, element, index, parent, root) {
    const { copyItem, deleteItem } = this.$listeners
    const visibility = 'visibility:' + (root && root.cmpType === 'custom' ? 'hidden;' : 'visible;')
    return [
      <span
        class="drawing-item-delete"
        style={visibility}
        title="删除"
        onClick={event => {
          deleteItem(index, parent)
          event.stopPropagation()
        }}
      >
        <i class="el-icon-close" />
      </span>
    ]
  }
}
const layouts = {
  colFormItem(h, element, index, parent, root) {
    const { activeItem } = this.$listeners
    let className = this.activeId === element.formId ? 'drawing-item active-from-item' : 'drawing-item'
    if (this.formConf.unFocusedComponentBorder) className += ' unfocus-bordered'

    return (
      <el-col
        span={element.span}
        class={className}
        nativeOnClick={event => {
          activeItem(element), event.stopPropagation()
        }}
      >
        <el-form-item label-width={element.labelWidth ? `${element.labelWidth}px` : null} label={element.label} required={element.required}>
          <render
            key={element.renderKey}
            conf={element}
            onInput={event => {
              this.$set(element, 'defaultValue', event)
            }}
          />
        </el-form-item>
        {components.itemBtns.apply(this, arguments)}
      </el-col>
    )
  },
  rowFormItem(h, element, index, parent) {
    const { activeItem } = this.$listeners
    const { put } = this.$attrs
    const className = this.activeId === element.formId ? 'drawing-row-item active-from-item' : 'drawing-row-item'

    let child = renderChildren.apply(this, arguments)
    if (element.type === 'flex') {
      child = (
        <el-row type={element.type} justify={element.justify} align={element.align}>
          {child}
        </el-row>
      )
    }
    const group = { name: 'componentsGroup', put: (...arg) => put(...arg, element) }
    const isCustom = element.cmpType === 'custom'
    return (
      <el-col span={element.span}>
        <el-row
          gutter={element.gutter}
          class={className}
          style="margin-left:0;"
          nativeOnClick={event => {
            activeItem(element), event.stopPropagation()
          }}
        >
          <span class="component-name">{element.label}</span>
          <draggable list={element.children} animation={0} group={group} disabled={isCustom} class={isCustom ? 'drag-wrapper' : ''}>
            {child}
          </draggable>

          {components.itemBtns.apply(this, arguments)}
          {element.rowType === 'table' && element.tag === 'fc-input-table' && (
            <div style="text-align: right;background: white;padding: 0;color: #19a97b;">
              <i class="el-icon-plus"></i> {element.actionText}
            </div>
          )}
        </el-row>
      </el-col>
    )
  }
}
// {element.tag !== 'fc-input-student' ? (
//   <draggable list={element.children} animation={0} group={group} disabled={isCustom} class={isCustom ? 'drag-wrapper' : ''}>
//     {child}
//   </draggable>
// ) : (
//   <a-row>
//     {element.children.map(conf => {
//       return (
//         <a-col span={conf.span} style="display:flex;" class="mb10">
//           {conf.tagType == 'conponent' ? (
//             <a-button type="primary" class="ml20">
//               {' '}
//               选择学员卡{' '}
//             </a-button>
//           ) : (
//             ''
//           )}
//           {conf.tagType == 'conponent' || conf.label == '业绩信息' ? '' : <div style={'width: 100px;text-align:right;'}>{conf.label}：</div>}
//         </a-col>
//       )
//     })}
//   </a-row>
// )}
// {element.rowType === 'table' && element.tag === 'fc-input-student' && (
//   <div class="tab_title">
//     <a-card>
//       <span>业绩信息</span>
//       <div class="mt20"></div>
//       <a-card>
//         <a-row>
//           <a-col class="mb10" span={12}>
//             {' '}
//             缴费业绩员工：{' '}
//           </a-col>
//           <a-col class="mb10" span={12}>
//             {' '}
//             缴费业绩分馆：{' '}
//           </a-col>
//           <a-col span={12}> 缴费业绩金额： </a-col>
//           <a-col span={12}> 缴费业绩比例： </a-col>
//         </a-row>
//       </a-card>
//     </a-card>
//   </div>
// )}
function renderChildren(h, element, index, parent) {
  if (!Array.isArray(element.children)) return null
  return element.children.map((el, i) => {
    const layout = layouts[el.layout]
    if (layout) {
      return layout.call(this, h, el, i, element.children, element)
    }
    return layoutIsNotFound()
  })
}

function layoutIsNotFound() {
  throw new Error(`没有与${this.element.layout}匹配的layout`)
}

export default {
  components: {
    render,
    draggable
  },
  props: ['element', 'index', 'drawingList', 'activeId', 'formConf'],
  render(h) {
    const layout = layouts[this.element.layout]

    if (layout) {
      return layout.call(this, h, this.element, this.index, this.drawingList)
    }
    return layoutIsNotFound()
  }
}
</script>
