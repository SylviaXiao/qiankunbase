/** *Copyright: Copyright (c) 2020 *Author:JakHuang *Version 1.0 *Title: form-generator/Element UI表单设计及代码生成器 *GitHub:
https://github.com/JakHuang/form-generator */
<template>
  <div class="right-board">
    <el-tabs v-model="currentTab" class="center-tabs">
      <el-tab-pane label="组件属性" name="field" />
      <el-tab-pane label="表单属性" name="form" />
    </el-tabs>
    <div class="field-box">
      <!-- <a class="document-link" target="_blank" :href="documentLink" title="查看组件文档">
        <i class="el-icon-link" />
      </a>-->
      <el-scrollbar class="right-scrollbar">
        <!-- 组件属性 -->
        <el-form v-show="currentTab === 'field' && showField" size="small" label-width="90px">
          <!-- <el-form-item v-if="activeData.changeTag" label="组件类型">
            <el-select
              v-model="activeData.tagIcon"
              placeholder="请选择组件类型"
              :style="{width: '100%'}"
              @change="tagChange"
            >
              <el-option-group v-for="group in tagList" :key="group.label" :label="group.label">
                <el-option
                  v-for="item in group.options"
                  :key="item.label"
                  :label="item.label"
                  :value="item.tagIcon"
                >
                  <svg-icon class="node-icon" :icon-class="item.tagIcon" />
                  <span> {{ item.label }}</span>
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>-->
          <!-- <el-form-item v-if="activeData.vModel!==undefined" label="字段名">
            <el-input v-model="activeData.vModel" placeholder="请输入字段名（v-model）" />
          </el-form-item>-->
          <!-- <el-form-item
            v-if="activeData.componentName!==undefined"
            label="组件名"
          >{{ activeData.componentName }}</el-form-item> -->
          <el-form-item v-if="activeData.label !== undefined" label="标题">
            <el-input v-model="activeData.label" placeholder="请输入标题" />
          </el-form-item>
          <el-form-item label="打印标题">
            <el-input v-model="activeData.printLabel" placeholder="请输入打印标题" />
          </el-form-item>
          <el-form-item v-if="activeData.placeholder !== undefined" label="占位提示">
            <el-input v-model="activeData.placeholder" placeholder="请输入占位提示" />
          </el-form-item>
          <el-form-item v-if="activeData.vModel !== undefined" label="表单key">
            <el-input v-model="activeData.vModel" placeholder="默认" />
          </el-form-item>
          <el-form-item v-if="activeData['start-placeholder'] !== undefined" label="开始占位">
            <el-input v-model="activeData['start-placeholder']" placeholder="请输入占位提示" />
          </el-form-item>
          <el-form-item v-if="activeData['end-placeholder'] !== undefined" label="结束占位">
            <el-input v-model="activeData['end-placeholder']" placeholder="请输入占位提示" />
          </el-form-item>
          <el-form-item v-if="activeData.span !== undefined" label="表单栅格">
            <el-slider v-model="activeData.span" :max="24" :min="1" :marks="{ 12: '' }" @change="spanChange" />
          </el-form-item>
          <el-form-item v-if="activeData.showDivider !== undefined" label="显示分割线">
            <el-switch v-model="activeData.showDivider" />
          </el-form-item>
          <el-form-item v-if="activeData['show-summary'] !== undefined" label="显示合计">
            <el-switch v-model="activeData['show-summary']" />
          </el-form-item>
          <!--
          <el-form-item v-if="activeData.layout==='rowFormItem'" label="栅格间隔">
            <el-input-number v-model="activeData.gutter" :min="0" placeholder="栅格间隔" />
          </el-form-item>
          <el-form-item v-if="activeData.layout==='rowFormItem'" label="布局模式">
            <el-radio-group v-model="activeData.type">
              <el-radio-button label="default" />
              <el-radio-button label="flex" />
            </el-radio-group>
          </el-form-item>-->
          <el-form-item v-if="activeData.justify !== undefined && activeData.type === 'flex'" label="水平排列">
            <el-select v-model="activeData.justify" placeholder="请选择水平排列" :style="{ width: '100%' }">
              <el-option v-for="(item, index) in justifyOptions" :key="index" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="activeData.align !== undefined && activeData.type === 'flex'" label="垂直排列">
            <el-radio-group v-model="activeData.align">
              <el-radio-button label="top" />
              <el-radio-button label="middle" />
              <el-radio-button label="bottom" />
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="activeData.labelWidth !== undefined" label="标签宽度">
            <el-input-number v-model.number="activeData.labelWidth" placeholder="请输入标签宽度" />
          </el-form-item>
          <el-form-item v-if="activeData.style && activeData.style.width !== undefined" label="组件宽度">
            <el-input v-model="activeData.style.width" placeholder="请输入组件宽度" clearable />
          </el-form-item>
          <el-form-item v-if="activeData.vModel !== undefined && activeData.layout !== 'rowFormItem' && notObject(activeData.defaultValue)" label="默认值">
            <el-input :value="setDefaultValue(activeData.defaultValue)" placeholder="请输入默认值" @input="onDefaultValueInput" />
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'el-checkbox-group'" label="至少应选">
            <el-input-number :value="activeData.min" :min="0" placeholder="至少应选" @input="$set(activeData, 'min', $event ? $event : undefined)" />
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'el-checkbox-group'" label="最多可选">
            <el-input-number :value="activeData.max" :min="0" placeholder="最多可选" @input="$set(activeData, 'max', $event ? $event : undefined)" />
          </el-form-item>
          <!-- <el-form-item v-if="activeData.prepend!==undefined" label="前缀">
            <el-input v-model="activeData.prepend" placeholder="请输入前缀" />
          </el-form-item>
          <el-form-item v-if="activeData.append!==undefined" label="后缀">
            <el-input v-model="activeData.append" placeholder="请输入后缀" />
          </el-form-item>
          <el-form-item v-if="activeData['prefix-icon']!==undefined" label="前图标">
            <el-input v-model="activeData['prefix-icon']" placeholder="请输入前图标名称">
              <el-button slot="append" icon="el-icon-thumb" @click="openIconsDialog('prefix-icon')">
                选择
              </el-button>
            </el-input>
          </el-form-item>
          <el-form-item v-if="activeData['suffix-icon'] !== undefined" label="后图标">
            <el-input v-model="activeData['suffix-icon']" placeholder="请输入后图标名称">
              <el-button slot="append" icon="el-icon-thumb" @click="openIconsDialog('suffix-icon')">
                选择
              </el-button>
            </el-input>
          </el-form-item>-->
          <!-- <el-form-item v-if="activeData.tag === 'el-cascader'" label="选项分隔符">
            <el-input v-model="activeData.separator" placeholder="请输入选项分隔符" />
          </el-form-item>-->
          <el-form-item v-if="activeData.autosize !== undefined" label="最小行数">
            <el-input-number v-model="activeData.autosize.minRows" :min="1" placeholder="最小行数" />
          </el-form-item>
          <el-form-item v-if="activeData.autosize !== undefined" label="最大行数">
            <el-input-number v-model="activeData.autosize.maxRows" :min="1" placeholder="最大行数" />
          </el-form-item>
          <el-form-item v-if="activeData.min !== undefined" label="最小值">
            <el-input-number v-model="activeData.min" placeholder="最小值" />
          </el-form-item>
          <el-form-item v-if="activeData.max !== undefined" label="最大值">
            <el-input-number v-model="activeData.max" placeholder="最大值" />
          </el-form-item>
          <el-form-item v-if="activeData.step !== undefined" label="步长">
            <el-input-number v-model="activeData.step" placeholder="步数" />
          </el-form-item>
          <el-form-item v-if="['el-input-number', 'fc-amount'].includes(activeData.tag)" label="精度">
            <el-input-number v-model="activeData.precision" :min="0" placeholder="精度" />
          </el-form-item>
          <el-form-item v-if="['el-input-number', 'fc-amount', 'fc-upload-quantity'].includes(activeData.tag)" label="按钮位置">
            <el-radio-group v-model="activeData['controls-position']">
              <el-radio-button label>默认</el-radio-button>
              <el-radio-button label="right">右侧</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="activeData.maxlength !== undefined" label="最多输入">
            <el-input v-model="activeData.maxlength" placeholder="请输入字符长度">
              <template slot="append"
                >个字符</template
              >
            </el-input>
          </el-form-item>
          <el-form-item v-if="activeData.actionText !== undefined" label="动作文字">
            <el-input v-model="activeData.actionText" placeholder="请输入动作文字" />
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'fc-input-table'" label="类型">
            <el-select size="small" v-model="activeData.type">
              <el-option label="列表" value="list"></el-option>
              <el-option label="表格" value="table"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item v-if="activeData['active-text'] !== undefined" label="开启提示">
            <el-input v-model="activeData['active-text']" placeholder="请输入开启提示" />
          </el-form-item>
          <el-form-item v-if="activeData['inactive-text'] !== undefined" label="关闭提示">
            <el-input v-model="activeData['inactive-text']" placeholder="请输入关闭提示" />
          </el-form-item>
          <el-form-item v-if="activeData['active-value'] !== undefined" label="开启值">
            <el-input
              :value="setDefaultValue(activeData['active-value'])"
              placeholder="请输入开启值"
              @input="onSwitchValueInput($event, 'active-value')"
            />
          </el-form-item>
          <el-form-item v-if="activeData['inactive-value'] !== undefined" label="关闭值">
            <el-input
              :value="setDefaultValue(activeData['inactive-value'])"
              placeholder="请输入关闭值"
              @input="onSwitchValueInput($event, 'inactive-value')"
            />
          </el-form-item>-->
          <el-form-item v-if="activeData.type !== undefined && ['el-date-picker', 'fc-date-duration'].includes(activeData.tag)" label="时间类型">
            <el-select v-model="activeData.type" placeholder="请选择时间类型" :style="{ width: '100%' }" @change="dateTypeChange">
              <el-option v-for="(item, index) in dateOptions" :key="index" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="['fc-date-select'].includes(activeData.tag)" label="时间禁用">
            <el-select v-model="activeData.disabledMonth" placeholder="请选择" :style="{ width: '100%' }" clearable>
              <el-option v-for="(item, index) in disabledMonthOptions" :key="index" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <!-- <el-form-item v-if="activeData.name !== undefined" label="文件字段名">
            <el-input v-model="activeData.name" placeholder="请输入上传文件字段名" />
          </el-form-item>-->
          <el-form-item v-if="activeData.accept !== undefined" label="文件类型">
            <el-select v-model="activeData.accept" placeholder="请选择文件类型" :style="{ width: '100%' }" clearable>
              <el-option label="图片" value="image/*" />
              <el-option label="视频" value="video/*" />
              <el-option label="音频" value="audio/*" />
              <el-option label="excel" value=".xls,.xlsx" />
              <el-option label="word" value=".doc,.docx" />
              <el-option label="pdf" value=".pdf" />
              <el-option label="txt" value=".txt" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="activeData.fileSize !== undefined" label="文件大小">
            <el-input v-model.number="activeData.fileSize" placeholder="请输入文件大小">
              <el-select slot="append" v-model="activeData.sizeUnit" :style="{ width: '66px' }">
                <el-option label="KB" value="KB" />
                <el-option label="MB" value="MB" />
                <el-option label="GB" value="GB" />
              </el-select>
            </el-input>
          </el-form-item>
          <!-- <el-form-item v-if="activeData.action !== undefined" label="上传地址">
            <el-input v-model="activeData.action" placeholder="请输入上传地址" clearable />
          </el-form-item> -->
          <el-form-item v-if="activeData['list-type'] !== undefined" label="列表类型">
            <el-radio-group v-model="activeData['list-type']" size="small">
              <el-radio-button label="text">text</el-radio-button>
              <el-radio-button label="picture">picture</el-radio-button>
              <el-radio-button label="picture-card">picture-card</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="activeData.buttonText !== undefined" v-show="'picture-card' !== activeData['list-type']" label="按钮文字">
            <el-input v-model="activeData.buttonText" placeholder="请输入按钮文字" />
          </el-form-item>
          <el-form-item v-if="activeData['range-separator'] !== undefined" label="分隔符">
            <el-input v-model="activeData['range-separator']" placeholder="请输入分隔符" />
          </el-form-item>
          <el-form-item v-if="activeData['picker-options'] !== undefined" label="时间段">
            <el-input v-model="activeData['picker-options'].selectableRange" placeholder="请输入时间段" />
          </el-form-item>
          <el-form-item v-if="activeData.format !== undefined" label="时间格式">
            <el-input :value="activeData.format" placeholder="请输入时间格式" @input="setTimeValue($event)" />
          </el-form-item>
          <el-form-item v-if="activeData['showDuration'] !== undefined" label="计算时长">
            <el-switch v-model="activeData['showDuration']" placeholder="自动计算时长" @change="requireChange" />
          </el-form-item>
          <template v-if="activeData.tag === 'fc-vote'">
            <el-form-item label="组件类型">
              <el-radio-group v-model="activeData.defaultType" size="small">
                <el-radio-button label="radio">单选</el-radio-button>
                <el-radio-button label="checkbox">多选</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </template>
          <template v-if="['el-checkbox-group', 'el-radio-group', 'el-select', 'fc-vote'].indexOf(activeData.tag) > -1">
            <el-divider>选项</el-divider>
            <draggable :list="activeData.options" :animation="340" group="selectItem" handle=".option-drag">
              <div v-for="(item, index) in activeData.options" :key="index" class="select-item">
                <div class="select-line-icon option-drag">
                  <i class="el-icon-s-operation" />
                </div>
                <div style="display: flex; flex-direction: column; width: 100%;">
                  <!--<el-input v-model="item.label" placeholder="选项名" size="small" />-->
                  <div>
                    <el-input placeholder="选项值" size="small" :value="item.value" @input="setOptionValue(item, $event)" />
                  </div>
                  <div style="margin-top: 5px" v-if="activeData.tag == 'fc-vote'">
                    <el-input placeholder="描述" size="small" :value="item.describe" @input="setOptionDescribe(item, $event)" />
                  </div>
                </div>
                <div class="close-btn select-line-icon" @click="activeData.options.splice(index, 1)">
                  <i class="el-icon-remove-outline" />
                </div>
              </div>
            </draggable>
            <div style="margin-left: 20px;">
              <el-button style="padding-bottom: 0" icon="el-icon-circle-plus-outline" type="text" @click="addSelectItem">添加选项</el-button>
            </div>
            <el-divider />
          </template>

          <template v-if="['el-cascader'].indexOf(activeData.tag) > -1">
            <el-divider>选项</el-divider>
            <el-form-item label="数据类型">
              <el-radio-group v-model="activeData.dataType" size="small">
                <el-radio-button label="dynamic">动态数据</el-radio-button>
                <el-radio-button label="static">静态数据</el-radio-button>
              </el-radio-group>
            </el-form-item>

            <template v-if="activeData.dataType === 'dynamic'">
              <el-form-item label="标签键名">
                <el-input v-model="activeData.labelKey" placeholder="请输入标签键名" />
              </el-form-item>
              <el-form-item label="值键名">
                <el-input v-model="activeData.valueKey" placeholder="请输入值键名" />
              </el-form-item>
              <el-form-item label="子级键名">
                <el-input v-model="activeData.childrenKey" placeholder="请输入子级键名" />
              </el-form-item>
            </template>

            <el-tree
              v-if="activeData.dataType === 'static'"
              draggable
              :data="activeData.options"
              node-key="id"
              :expand-on-click-node="false"
              :render-content="renderContent"
            />
            <div v-if="activeData.dataType === 'static'" style="margin-left: 20px">
              <el-button style="padding-bottom: 0" icon="el-icon-circle-plus-outline" type="text" @click="addTreeItem">添加父级</el-button>
            </div>
            <el-divider />
          </template>

          <template v-if="activeData.tag === 'fc-input-verify'">
            <el-form-item label="请求地址">
              <el-input v-model="activeData.url" placeholder="请输入请求地址" />
            </el-form-item>
            <el-form-item label="请求方式">
              <el-select v-model="activeData.method" placeholder="请选择请求方式" :style="{ width: '100%' }">
                <el-option label="get" value="get" />
                <el-option label="post" value="post" />
              </el-select>
            </el-form-item>
            <el-form-item label="参数名">
              <el-input v-model="activeData.paramsKey" placeholder="请输入参数名" />
            </el-form-item>
            <el-form-item label="触发方式">
              <el-select v-model="activeData.defaultType" placeholder="请选择触发方式" :style="{ width: '100%' }">
                <el-option label="按钮触发" value="button" />
                <el-option label="提交触发" value="submit" />
              </el-select>
            </el-form-item>
          </template>

          <template v-if="activeData.tag === 'fc-api-select'">
            <el-form-item label="请求来源">
              <el-select v-model="activeData.source" placeholder="请选择请求方式" :style="{ width: '100%' }">
                <el-option label="erp" value="erp" />
                <el-option label="审批" value="approval" />
              </el-select>
            </el-form-item>
            <el-form-item label="请求地址">
              <el-input v-model="activeData.url" placeholder="请输入请求地址" />
            </el-form-item>
            <el-form-item label="请求方式">
              <el-select v-model="activeData.method" placeholder="请选择请求方式" :style="{ width: '100%' }">
                <el-option label="get" value="get" />
                <el-option label="post" value="post" />
              </el-select>
            </el-form-item>
            <el-form-item label="key">
              <el-input v-model="activeData.optionKey" placeholder="请输入key" />
            </el-form-item>
            <el-form-item label="value">
              <el-input v-model="activeData.optionValue" placeholder="请输入value" />
            </el-form-item>
            <el-form-item label="关联字段">
              <el-select clearable v-model="activeData.bindPrice" placeholder="请选择关联字段" :style="{ width: '100%' }">
                <el-option v-for="(item, index) in apiSelectRelation" :key="index" :label="item.label" :value="item.vModel" />
              </el-select>
            </el-form-item>
            <el-form-item label="关联参数">
              <el-input type="text" v-model="activeData.bindPriceKey" placeholder="请输入关联字段的参数名" />
            </el-form-item>
          </template>

          <el-form-item v-if="activeData.optionType !== undefined" label="选项样式">
            <el-radio-group v-model="activeData.optionType">
              <el-radio-button label="default">默认</el-radio-button>
              <el-radio-button label="button">按钮</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="activeData['active-color'] !== undefined" label="开启颜色">
            <el-color-picker v-model="activeData['active-color']" />
          </el-form-item>
          <el-form-item v-if="activeData['inactive-color'] !== undefined" label="关闭颜色">
            <el-color-picker v-model="activeData['inactive-color']" />
          </el-form-item>

          <el-form-item v-if="activeData['allow-half'] !== undefined" label="允许半选">
            <el-switch v-model="activeData['allow-half']" />
          </el-form-item>
          <el-form-item v-if="activeData['show-text'] !== undefined" label="辅助文字">
            <el-switch v-model="activeData['show-text']" @change="rateTextChange" />
          </el-form-item>
          <el-form-item v-if="activeData['show-score'] !== undefined" label="显示分数">
            <el-switch v-model="activeData['show-score']" @change="rateScoreChange" />
          </el-form-item>
          <el-form-item v-if="activeData['show-stops'] !== undefined" label="显示间断点">
            <el-switch v-model="activeData['show-stops']" />
          </el-form-item>
          <el-form-item v-if="activeData.range !== undefined" label="范围选择">
            <el-switch v-model="activeData.range" @change="rangeChange" />
          </el-form-item>
          <!-- <el-form-item
            v-if="activeData.border !== undefined && activeData.optionType === 'default'"
            label="是否带边框"
          >
            <el-switch v-model="activeData.border" />
          </el-form-item>-->
          <el-form-item v-if="activeData.tag === 'el-color-picker'" label="颜色格式">
            <el-select v-model="activeData['color-format']" placeholder="请选择颜色格式" :style="{ width: '100%' }" @change="colorFormatChange">
              <el-option v-for="(item, index) in colorFormatOptions" :key="index" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>

          <template v-if="activeData.tag === 'fc-org-select'">
            <el-form-item label="弹框名称" v-if="activeData.title !== undefined">
              <el-input v-model="activeData.title" placeholder="请输入弹框名称" />
            </el-form-item>

            <el-form-item label="可选数量" v-if="activeData.maxNum !== undefined">
              <el-input-number v-model="activeData.maxNum" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="按钮类型">
              <el-select v-model="activeData.buttonType" size="small">
                <el-option label="Button" value="button" />
                <el-option label="Input" value="input" />
              </el-select>
            </el-form-item>

            <template v-if="activeData.buttonType === 'button' && activeData.tagConfig">
              <el-divider content-position="left">标签展示</el-divider>
              <el-form-item label="大小" v-if="activeData.tagConfig.size !== undefined">
                <el-radio-group v-model="activeData.tagConfig.size">
                  <el-radio-button label="medium">中等</el-radio-button>
                  <el-radio-button label="small">较小</el-radio-button>
                  <el-radio-button label="mini">迷你</el-radio-button>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="主题" v-if="activeData.tagConfig.effect !== undefined">
                <el-select v-model="activeData.tagConfig.effect" placeholder="请选择">
                  <el-option v-for="item in themeOptions" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled"> </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="标签样式" v-if="activeData.tagConfig.type !== undefined">
                <el-select v-model="activeData.tagConfig.type" placeholder="请选择">
                  <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled"> </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="渐变动画" v-if="activeData.tagConfig['disable-transitions'] !== undefined">
                <el-switch v-model="activeData.tagConfig['disable-transitions']" :inactive-value="true" :active-value="false" placeholder="请输入" />
              </el-form-item>

              <el-form-item label="边框描边" v-if="activeData.tagConfig.hit !== undefined">
                <el-switch v-model="activeData.tagConfig.hit" placeholder="请输入" />
              </el-form-item>
            </template>
          </template>

          <el-form-item
            v-if="activeData.size !== undefined && (activeData.optionType === 'button' || activeData.border || activeData.tag === 'el-color-picker')"
            label="选项尺寸"
          >
            <el-radio-group v-model="activeData.size">
              <el-radio-button label="medium">中等</el-radio-button>
              <el-radio-button label="small">较小</el-radio-button>
              <el-radio-button label="mini">迷你</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <!-- <el-form-item v-if="activeData['show-word-limit'] !== undefined" label="输入统计">
            <el-switch v-model="activeData['show-word-limit']" />
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'el-input-number'" label="严格步数">
            <el-switch v-model="activeData['step-strictly']" />
          </el-form-item>-->
          <el-form-item v-if="activeData.tag === 'el-cascader'" label="是否多选">
            <el-switch v-model="activeData.props.props.multiple" />
          </el-form-item>
          <!-- <el-form-item v-if="activeData.tag === 'el-cascader'" label="展示全路径">
            <el-switch v-model="activeData['show-all-levels']" />
          </el-form-item>-->
          <el-form-item v-if="activeData.tag === 'el-cascader'" label="可否筛选">
            <el-switch v-model="activeData.filterable" />
          </el-form-item>
          <!-- <el-form-item v-if="activeData.clearable !== undefined" label="能否清空">
            <el-switch v-model="activeData.clearable" />
          </el-form-item>-->
          <el-form-item v-if="activeData.showTip !== undefined" label="显示提示">
            <el-switch v-model="activeData.showTip" />
          </el-form-item>

          <el-form-item v-if="activeData.tag === 'el-upload' && activeData.multiple !== undefined" label="多选文件">
            <el-switch v-model="activeData.multiple" />
          </el-form-item>
          <el-form-item v-if="activeData['auto-upload'] !== undefined" label="自动上传">
            <el-switch v-model="activeData['auto-upload']" />
          </el-form-item>
          <el-form-item v-if="activeData.readonly !== undefined" label="是否只读">
            <el-switch v-model="activeData.readonly" />
          </el-form-item>
          <!-- <el-form-item v-if="activeData.disabled !== undefined" label="是否禁用">
            <el-switch v-model="activeData.disabled" />
          </el-form-item> -->
          <el-form-item v-if="activeData.expression !== undefined" label="计算公式">
            <div @click="expDialogVisible = true" class="pane-calc-preview">
              <span
                v-for="(item, index) in activeData.expression"
                :key="index"
                :class="{ 'calc-btn': typeof item !== 'string', error: typeof item !== 'string' && item.label === '无效的值' }"
              >
                {{ typeof item !== 'string' ? item.label : item }}
              </span>
            </div>
          </el-form-item>
          <el-form-item v-if="activeData.condition !== undefined" label="验证规则">
            <div @click="conDialogVisible = true" class="pane-calc-preview">
              <span
                v-for="(item, index) in activeData.condition"
                :key="index"
                :class="{ 'calc-btn': typeof item !== 'string', error: typeof item !== 'string' && item.label === '无效的值' }"
              >
                {{ typeof item !== 'string' ? item.label : item }}
              </span>
              <span>{{ activeData.defaultValue }}</span>
            </div>
          </el-form-item>
          <el-form-item v-if="activeData.type === 'selectBranch'" label="默认分馆">
            <el-switch v-model="activeData.defaultBranch" />
          </el-form-item>
          <el-form-item v-if="activeData.type === 'uploadFile'" label="附件类型">
            <el-select v-model="activeData.uploadFileType" placeholder="请选择附件类型" :style="{ width: '100%' }">
              <el-option label="默认" value="default" />
              <el-option label="发票" value="invoice" />
              <el-option label="考勤表" value="timeSheet" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="activeData.type === 'selectBranch'" label="分馆类型">
            <el-select v-model="activeData.defaultType" placeholder="请选择分馆类型" :style="{ width: '100%' }">
              <el-option label="默认" value="default" />
              <el-option label="财务分馆" value="finance" />
              <el-option label="审批角色" value="approver" />
              <el-option label="付款分馆" value="paidDept" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="activeData.type === 'selectBranch' && activeData.defaultType == 'approver'" label="分馆类型">
            <el-select v-model="activeData.approverBranchId" placeholder="请选择分馆类型" :style="{ width: '100%' }">
              <el-option v-for="item in approverBranchList" :key="item.roleId" :label="item.roleName" :value="item.roleId" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="activeData.type === 'filterBank'" label="银行类型">
            <el-select v-model="activeData.defaultType" placeholder="请选择银行类型" :style="{ width: '100%' }">
              <el-option label="分馆银行" value="default" />
              <el-option label="审批人银行" value="approver" />
            </el-select>
          </el-form-item>
          <!-- 可输入银行类型 -->
          <el-form-item v-if="activeData.tag === 'fc-select-bank'" label="银行类型">
            <el-select v-model="activeData.defaultType" placeholder="请选择银行类型" :style="{ width: '100%' }">
              <el-option label="普通收款银行" value="default" />
              <el-option label="明细收款银行" value="table" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'fc-select-costType'" label="费用类型">
            <el-select v-model="activeData.approveType" placeholder="请选择类型" :style="{ width: '100%' }">
              <el-option label="报销单" value="报销单" />
              <el-option label="资金调入" value="资金调入" />
              <el-option label="资金调出" value="资金调出" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="activeData.tag === 'fc-select-costType'" label="类型">
            <el-select v-model="activeData.defaultType" placeholder="请选择类型" :style="{ width: '100%' }">
              <el-option label="费用归类" value="feeItemName" />
              <el-option label="财务归类" value="financeName" />
              <el-option label="经营归类" value="operateName" />
              <el-option label="成本归类" value="costName" />
            </el-select>
          </el-form-item>

          <el-form-item v-if="activeData.tag === 'fc-select-costType'" label="关联类型">
            <el-select clearable v-model="activeData.bindTypePrice" placeholder="请选择关联类型字段" :style="{ width: '100%' }">
              <el-option v-for="(item, index) in unitCmps" :key="index" :label="item.label" :value="item.vModel" />
            </el-select>
          </el-form-item>

          <el-form-item v-if="activeData.tag === 'fc-select-employee'" label="员工类型">
            <el-select v-model="activeData.defaultType" placeholder="请选择员工类型" :style="{ width: '100%' }">
              <el-option label="默认" value="default" />
              <el-option label="导师" value="teacher" />
              <el-option label="学员" value="student" />
            </el-select>
          </el-form-item>

          <el-form-item
            v-if="
              activeData.tag === 'fc-apportion' ||
                activeData.tag === 'fc-select-unit' ||
                activeData.tag === 'fc-filter-bank' ||
                activeData.tag === 'fc-select-costType' ||
                (activeData.tag === 'fc-uploadFile' && activeData.uploadFileType === 'invoice') ||
                activeData.tag == 'fc-total-money' ||
                activeData.tag == 'fc-upload-quantity' ||
                activeData.tag == 'fc-select-feeType' ||
                activeData.tag == 'fc-select-finance'
            "
            label="关联字段"
          >
            <el-select clearable v-model="activeData.bindPrice" placeholder="请选择关联字段" :style="{ width: '100%' }">
              <el-option v-for="(item, index) in unitCmps" :key="index" :label="item.label" :value="item.vModel" />
            </el-select>
          </el-form-item>

          <el-form-item v-if="activeData.condition !== undefined" label="验证提示文字">
            <el-input type="text" v-model="activeData.conValue" />
          </el-form-item>
          <el-form-item v-if="activeData.required !== undefined" label="是否必填">
            <el-switch v-model="activeData.required" @change="requireChange" :disabled="!couldChangeRequire" />
            <el-tooltip class="item" effect="dark" placement="top-start">
              <div slot="content">
                流程条件：流程设计里可用于区分流程走向
                <br />
                例如：金额大于500需要主管+经理审批；小于500只需要主管审批。
              </div>
              <span v-show="activeData.proCondition" style="font-size:12px;color#aaa;">&nbsp;(勾选后可作为流程条件)</span>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="是否可打印">
            <el-switch v-model="activeData.isPrint" />
          </el-form-item>
          <el-form-item v-if="activeData.showChinese !== undefined || activeData.tag == 'fc-total-money'" label="显示大写">
            <el-switch v-model="activeData.showChinese" />
          </el-form-item>

          <el-form-item label="作为摘要" v-if="activeData.asSummary !== undefined">
            <el-switch v-model="activeData.asSummary" />
          </el-form-item>

          <el-form-item v-if="activeData.tag === 'el-select'" label="是否可搜索">
            <el-switch v-model="activeData.filterable" />
          </el-form-item>

          <el-form-item v-if="activeData.tag === 'el-select'" label="是否多选">
            <el-switch v-model="activeData.multiple" @change="multipleChange" />
          </el-form-item>

          <el-form-item v-if="activeData.cmpType === 'custom'" label="组件说明">
            <el-input type="textarea" v-model="activeData.explain" />
          </el-form-item>

          <el-form-item label="业绩类型" v-if="activeData.tag === 'fc-per-list'">
            <el-select v-model="activeData.defaultType" placeholder="请选择业绩类型" :style="{ width: '100%' }">
              <el-option label="顾问业绩" value="adviser" />
              <el-option label="导师业绩" value="teacher" />
            </el-select>
          </el-form-item>

          <!-- draggable -->
          <!-- <template v-if="activeData.layoutTree">
            <el-divider>布局结构树</el-divider>
            <el-tree
              :data="[activeData]"
              :props="layoutTreeProps"
              node-key="renderKey"
              default-expand-all
            >
              <span slot-scope="{ node, data }">
                <span class="node-label">
                  <svg-icon class="node-icon" :icon-class="data.tagIcon" />
                  {{ node.label }}
                </span>
              </span>
            </el-tree>
          </template> -->
          <!-- <template v-if="activeData.regList !== undefined">
            <el-divider>正则校验</el-divider>
            <div v-for="(item, index) in activeData.regList" :key="index" class="reg-item">
              <span class="close-btn" @click="activeData.regList.splice(index, 1)">
                <i class="el-icon-close" />
              </span>
              <div @click="repDialogVisible = true" style="cursor:pointer;">
                <el-form-item label="表达式">
                  <el-input v-model="item.pattern" placeholder="请输入正则" readonly />
                </el-form-item>
              </div>
              <el-form-item label="错误提示" style="margin-bottom:0">
                <el-input v-model="item.message" placeholder="请输入错误提示" />
              </el-form-item>
            </div>
            <div style="margin-left: 20px">
              <el-button icon="el-icon-circle-plus-outline" type="text" @click="addReg">
                添加规则
              </el-button>
            </div>
          </template> -->
        </el-form>
        <!-- 表单属性 -->
        <el-form v-show="currentTab === 'form'" size="small" label-width="90px">
          <el-form-item label="表单名">
            <el-input v-model="formConf.formRef" placeholder="请输入表单名（ref）" />
          </el-form-item>
          <!-- <el-form-item label="表单模型">
            <el-input v-model="formConf.formModel" placeholder="请输入数据模型" />
          </el-form-item>
          <el-form-item label="校验模型">
            <el-input v-model="formConf.formRules" placeholder="请输入校验模型" />
          </el-form-item>-->
          <el-form-item label="表单尺寸">
            <el-radio-group v-model="formConf.size">
              <el-radio-button label="medium">中等</el-radio-button>
              <el-radio-button label="small">较小</el-radio-button>
              <el-radio-button label="mini">迷你</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="标签对齐">
            <el-radio-group v-model="formConf.labelPosition">
              <el-radio-button label="left">左对齐</el-radio-button>
              <el-radio-button label="right">右对齐</el-radio-button>
              <el-radio-button label="top">顶部对齐</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="标签宽度">
            <el-input-number v-model="formConf.labelWidth" placeholder="标签宽度" />
          </el-form-item>
          <el-form-item label="栅格间隔">
            <el-input-number v-model="formConf.gutter" :min="0" placeholder="栅格间隔" />
          </el-form-item>
          <!-- <el-form-item label="禁用表单">
            <el-switch v-model="formConf.disabled" />
          </el-form-item>
          <el-form-item label="表单按钮">
            <el-switch v-model="formConf.formBtns" />
          </el-form-item>
          <el-form-item label="显示未选中组件边框">
            <el-switch v-model="formConf.unFocusedComponentBorder" />
          </el-form-item>-->
        </el-form>
      </el-scrollbar>
    </div>
    <treeNode-dialog :visible.sync="dialogVisible" title="添加选项" @commit="addNode" />
    <icons-dialog :visible.sync="iconsVisible" :current="activeData[currentIconModel]" @select="setIcon" />
    <el-dialog title="编辑条件计算公式" custom-class="calc-dialog" :visible.sync="expDialogVisible" width="600px">
      <div class="calc-box">
        <el-alert v-show="!expValid" title="编辑的公式不符合计算法则，无法计算" type="error" show-icon> </el-alert>
        <div class="calc-preview" :class="{ error: !expValid }">
          计算公式 =
          <span
            v-for="(item, index) in expressionTemp"
            :key="index"
            :class="{ 'calc-btn': typeof item !== 'string', error: typeof item !== 'string' && item.label === '无效的值' }"
          >
            {{ typeof item !== 'string' ? item.label : item }}
          </span>
          <div class="preview-actions">
            <i class="el-icon-price-tag" style="transform: rotate(-90deg);" @click="expressionTemp.pop()"></i>
            <i class="el-icon-delete" @click="expressionTemp = []"></i>
          </div>
        </div>
        <div class="calc-tip">
          编辑计算公式可用来完成审批单内数据的自动结算，例如：采购单内设置计算公式“合计=单价×数量”，发起人填写单价、数量后，组件将自动计算出合计金额，免手动计算
        </div>
        <div>
          <span>计算对象：</span>
          <span v-for="item in calculateCmps" :key="item.vModel" @click="expressionTemp.push(item)" class="calc-btn">
            {{ item.label }}
          </span>
        </div>
        <div style="margin: 10px 0;">
          <span>计算符号：</span>
          <span v-for="item in ['+', '-', '×', '÷', '(', ')']" class="calc-btn" :key="item" @click="expressionTemp.push(item)">{{ item }}</span>
        </div>

        <div style="margin: 10px 0;">
          <span style="float: left;">数字键盘：</span>
          <div style="width: 110px;line-height: 2.5;overflow: hidden;">
            <span :key="item" class="calc-btn" v-for="item in ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.']" @click="expressionTemp.push(item)">{{
              item
            }}</span>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="
            expDialogVisible = false
            expressionTemp = []
          "
          size="mini"
          >取 消</el-button
        >
        <el-button type="primary" @click="checkExpression" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑验证规则" custom-class="calc-dialog" :visible.sync="conDialogVisible" width="600px">
      <div class="calc-box">
        <el-alert v-show="!expValidCon" title="编辑的公式不符合条件计算法则，无法计算" type="error" show-icon> </el-alert>
        <div class="calc-preview" :class="{ error: !expValidCon }">
          条件计算公式 =
          <span
            v-for="(item, index) in condotionTemp"
            :key="index"
            :class="{ 'calc-btn': typeof item !== 'string', error: typeof item !== 'string' && item.label === '无效的值' }"
          >
            {{ typeof item !== 'string' ? item.label : item }}
          </span>
          <div class="preview-actions">
            <i class="el-icon-price-tag" style="transform: rotate(-90deg);" @click="condotionTemp.pop()"></i>
            <i class="el-icon-delete" @click="condotionTemp = []"></i>
          </div>
        </div>
        <div class="calc-tip">
          编辑条件计算公式可用来完成审批单内数据的自动结算，例如：采购单内设置条件计算公式“合计=单价×数量”，发起人填写单价、数量后，组件将自动计算出合计金额，免手动计算
        </div>
        <div>
          <span>条件计算对象：</span>
          <span v-for="item in calculateCmps" :key="item.vModel" @click="condotionTemp.push(item)" class="calc-btn">
            {{ item.label }}
          </span>
        </div>
        <div style="margin: 10px 0;">
          <span>计算符号：</span>
          <span v-for="item in ['+', '-', '×', '÷', '(', ')']" class="calc-btn" :key="item" @click="condotionTemp.push(item)">{{ item }}</span>
        </div>
        <div style="margin: 10px 0;">
          <span>条件符号：</span>
          <span v-for="item in ['>', '<', '==', '>=', '<=', '!==']" class="calc-btn" :key="item" @click="condotionTemp.push(item)">{{ item }}</span>
        </div>
        <div style="margin: 10px 0;">
          <span style="float: left;">数字键盘：</span>
          <div style="width: 110px;line-height: 2.5;overflow: hidden;">
            <span :key="item" class="calc-btn" v-for="item in ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.']" @click="condotionTemp.push(item)">{{
              item
            }}</span>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="
            conDialogVisible = false
            condotionTemp = []
          "
          size="mini"
          >取 消</el-button
        >
        <el-button type="primary" @click="checkCondition" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑验证规则" custom-class="calc-dialog" :visible.sync="repDialogVisible" width="600px">
      <div class="calc-box">
        <el-alert v-show="!expValidCon" title="编辑的公式不符合条件计算法则，无法计算" type="error" show-icon> </el-alert>
        <div class="calc-preview" :class="{ error: !expValidCon }">
          条件计算公式 =
          <span
            v-for="(item, index) in condotionTemp"
            :key="index"
            :class="{ 'calc-btn': typeof item !== 'string', error: typeof item !== 'string' && item.label === '无效的值' }"
          >
            {{ typeof item !== 'string' ? item.label : item }}
          </span>
          <div class="preview-actions">
            <i class="el-icon-price-tag" style="transform: rotate(-90deg);" @click="condotionTemp.pop()"></i>
            <i class="el-icon-delete" @click="condotionTemp = []"></i>
          </div>
        </div>
        <div class="calc-tip">
          编辑条件计算公式可用来完成审批单内数据的自动结算，例如：采购单内设置条件计算公式“合计=单价×数量”，发起人填写单价、数量后，组件将自动计算出合计金额，免手动计算
        </div>
        <div>
          <span>条件计算对象：</span>
          <span v-for="item in calculateCmps" :key="item.vModel" @click="condotionTemp.push(item)" class="calc-btn">
            {{ item.label }}
          </span>
        </div>
        <div style="margin: 10px 0;">
          <span>计算符号：</span>
          <span v-for="item in ['+', '-', '×', '÷', '(', ')']" class="calc-btn" :key="item" @click="condotionTemp.push(item)">{{ item }}</span>
        </div>
        <div style="margin: 10px 0;">
          <span>条件符号：</span>
          <span v-for="item in ['>', '<', '==', '>=', '<=', '!==']" class="calc-btn" :key="item" @click="condotionTemp.push(item)">{{ item }}</span>
        </div>
        <div style="margin: 10px 0;">
          <span style="float: left;">数字键盘：</span>
          <div style="width: 110px;line-height: 2.5;overflow: hidden;">
            <span :key="item" class="calc-btn" v-for="item in ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.']" @click="condotionTemp.push(item)">{{
              item
            }}</span>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="
            repDialogVisible = false
            condotionTemp = []
          "
          size="mini"
          >取 消</el-button
        >
        <el-button type="primary" @click="checkCondition" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { workflowListWorkflowRole } from '@/api/workFlow/request.js'
import { isArray } from 'util'
import TreeNodeDialog from './TreeNodeDialog'
import { isNumberStr } from './utils/index'
import IconsDialog from './IconsDialog'
import { inputComponents, selectComponents, layoutComponents } from './components/generator/config'
import { saveFormConf } from './utils/db'
import draggable from 'vuedraggable'
import { mergeNumberOfExps, validExp, toRPN, calcRPN, validExpCon } from '@/assets/utils/index.js'
const dateTimeFormat = {
  date: 'yyyy-MM-dd',
  week: 'yyyy 第 WW 周',
  month: 'yyyy-MM',
  year: 'yyyy',
  datetime: 'yyyy-MM-dd HH:mm:ss',
  daterange: 'yyyy-MM-dd',
  monthrange: 'yyyy-MM',
  datetimerange: 'yyyy-MM-dd HH:mm:ss'
}
export default {
  components: {
    TreeNodeDialog,
    IconsDialog,
    draggable
  },
  created() {
    this.initBranchList()
  },
  props: ['showField', 'activeData', 'formConf', 'couldChangeRequire'],
  data() {
    return {
      approverBranchList: [], //审批人角色列表
      proConditionCmp: ['el-input-number', 'el-select', 'el-radio-group'], // 可作为流程图条件的组件
      currentTab: 'field',
      currentNode: null,
      dialogVisible: false,
      iconsVisible: false,
      currentIconModel: null,
      expDialogVisible: false,
      expressionTemp: [],
      conDialogVisible: false,
      condotionTemp: [],
      expValid: true,
      expValidCon: true,
      repDialogVisible: false,
      disabledMonthOptions:[{ value: 'A', label: '当月之后' }],
      themeOptions: [{ value: 'dark', label: '深色' }, { value: 'light', label: '亮色' }, { value: 'plain', label: '扁平' }],
      typeOptions: [
        {
          value: 'success',
          label: 'success'
        },
        {
          value: 'info',
          label: 'info'
        },
        {
          value: 'warning',
          label: 'warning'
        },
        {
          value: 'danger',
          label: 'danger'
        }
      ],
      dateTypeOptions: [
        {
          label: '日(date)',
          value: 'date'
        },
        {
          label: '周(week)',
          value: 'week'
        },
        {
          label: '月(month)',
          value: 'month'
        },
        {
          label: '年(year)',
          value: 'year'
        },
        {
          label: '日期时间(datetime)',
          value: 'datetime'
        }
      ],
      dateRangeTypeOptions: [
        {
          label: '日期范围(daterange)',
          value: 'daterange'
        },
        {
          label: '月范围(monthrange)',
          value: 'monthrange'
        },
        {
          label: '日期时间范围(datetimerange)',
          value: 'datetimerange'
        }
      ],
      colorFormatOptions: [
        {
          label: 'hex',
          value: 'hex'
        },
        {
          label: 'rgb',
          value: 'rgb'
        },
        {
          label: 'rgba',
          value: 'rgba'
        },
        {
          label: 'hsv',
          value: 'hsv'
        },
        {
          label: 'hsl',
          value: 'hsl'
        }
      ],
      justifyOptions: [
        {
          label: 'start',
          value: 'start'
        },
        {
          label: 'end',
          value: 'end'
        },
        {
          label: 'center',
          value: 'center'
        },
        {
          label: 'space-around',
          value: 'space-around'
        },
        {
          label: 'space-between',
          value: 'space-between'
        }
      ],
      layoutTreeProps: {
        label(data, node) {
          return data.componentName || `${data.label}: ${data.vModel}`
        }
      }
    }
  },
  computed: {
    // documentLink() {
    //   return (
    //     this.activeData.document
    //     || 'https://element.eleme.cn/#/zh-CN/component/installation'
    //   )
    // },
    dateOptions() {
      if (this.activeData.type !== undefined && ['el-date-picker', 'fc-date-duration'].includes(this.activeData.tag)) {
        if (this.activeData['start-placeholder'] === undefined) {
          return this.dateTypeOptions
        }
        return this.dateRangeTypeOptions
      }
      return []
    },
    tagList() {
      return [
        {
          label: '输入型组件',
          options: inputComponents
        },
        {
          label: '选择型组件',
          options: selectComponents
        }
      ]
    },
    calculateCmps() {
      const calcList = []
      const loop = (data, parent) => {
        if (!data) return
        if (Array.isArray(data.children)) {
          loop(data.children, data)
        }
        if (Array.isArray(data)) data.forEach(d => loop(d, parent))
        if (['el-input-number', 'fc-amount', 'fc-condition', 'fc-total-money'].includes(data.tag)) {
          const isTableChild = parent && parent.rowType === 'table'
          calcList.push({
            vModel: isTableChild ? parent.vModel + '.' + data.vModel : data.vModel,
            label: isTableChild ? parent.label + '.' + data.label : data.label
          })
        }
      }
      loop(this.$store.state.formItemList)
      return calcList
    },
    unitCmps() {
      const calcList = []
      const loop = (data, parent) => {
        if (!data) return
        if (Array.isArray(data.children)) {
          loop(data.children, data)
        }
        if (Array.isArray(data)) data.forEach(d => loop(d, parent))
        if (
          [
            'el-input-number',
            'fc-amount',
            'fc-condition',
            'fc-select-feeName',
            'fc-select-branch',
            'fc-select-finance',
            'fc-select-costType',
            'fc-uploadFile',
            'fc-total-money',
            'el-radio-group',
            'fc-api-select'
          ].includes(data.tag)
        ) {
          const isTableChild = parent && parent.rowType === 'table'
          calcList.push({
            vModel: isTableChild ? parent.vModel + '.' + data.vModel : data.vModel,
            label: isTableChild ? parent.label + '.' + data.label : data.label
          })
        }
      }
      loop(this.$store.state.formItemList)
      return calcList
    },
    apiSelectRelation() {
      const calcList = []
      const loop = (data, parent) => {
        if (!data) return
        if (Array.isArray(data.children)) {
          loop(data.children, data)
        }
        if (Array.isArray(data)) data.forEach(d => loop(d, parent))
        if (data.tag === 'fc-api-select') {
          const isTableChild = parent && parent.rowType === 'table'
          calcList.push({
            vModel: isTableChild ? parent.vModel + '.' + data.vModel : data.vModel,
            label: isTableChild ? parent.label + '.' + data.label : data.label
          })
        }
      }
      loop(this.$store.state.formItemList)
      return calcList
    }
  },
  watch: {
    formConf: {
      handler(val) {
        saveFormConf(val)
      },
      deep: true
    },
    activeData(val) {
      if (val.tag !== 'fc-calculate') return
      this.reloadExpressionTemp()
    }
  },
  methods: {
    initBranchList() {
      workflowListWorkflowRole({
        page: 0,
        limit: 0
      }).then(res => {
        if ((res.code === 200 || res.code === '200') && res.data) {
          this.approverBranchList = res.data
        } else {
          this.approverBranchList = []
        }
      })
    },
    notObject(val) {
      return val === null || val === undefined || Object(val) !== val
    },
    reloadExpressionTemp() {
      const isValid = d => {
        const target = this.calculateCmps.find(cmp => cmp.vModel === d.vModel && cmp.label === d.label)
        return target ? true : false
      }
      this.expressionTemp = this.activeData.expression.map(t => {
        return typeof t === 'string' || isValid(t) ? t : { vModel: t.vModel, label: '无效的值' }
      })
      this.activeData.expression = this.expressionTemp
    },
    requireChange(required) {
      // 下拉 单选 计数 日期区间 时间区间 需要写进流程条件中
      if (!this.activeData.proCondition) return
      if (required && !this.activeData.multiple) {
        // 没有设置时长的时间范围组件不能作为流程条件
        const isRangeCmp = ['fc-date-duration', 'fc-time-duration'].includes(this.activeData.tag)
        const showDuration = this.activeData.showDuration
        if (isRangeCmp && !showDuration) {
          this.$store.commit('delPCondition', this.activeData.formId)
          return
        }
        this.$store.commit('addPCondition', this.activeData)
      } else {
        this.$store.commit('delPCondition', this.activeData.formId)
      }
    },
    checkExpression() {
      let formatExp = mergeNumberOfExps(this.expressionTemp)
      const temp = formatExp.map(t => (typeof t === 'object' ? 1 : t))
      this.expValid = validExp(temp, false)
      if (this.expValid) {
        this.activeData.expression = JSON.parse(JSON.stringify(this.expressionTemp)) // calcRPN(toRPN(formatExp))
        this.expDialogVisible = false
      }
    },
    checkCondition() {
      let formatExp = mergeNumberOfExps(this.condotionTemp)
      const temp = formatExp.map(t => (typeof t === 'object' ? 1 : t))
      this.expValidCon = validExpCon(temp, false)
      if (this.expValidCon) {
        this.activeData.condition = JSON.parse(JSON.stringify(this.condotionTemp)) // calcRPN(toRPN(formatExp))
        this.conDialogVisible = false
      }
    },
    addReg() {
      this.activeData.regList.push({
        pattern: '',
        message: ''
      })
    },
    addSelectItem() {
      this.activeData.options.push({
        label: '',
        value: ''
      })
    },
    addTreeItem() {
      ++this.idGlobal
      this.dialogVisible = true
      this.currentNode = this.activeData.options
    },
    renderContent(h, { node, data, store }) {
      return (
        <div class="custom-tree-node">
          <span>{node.label}</span>
          <span class="node-operation">
            <i on-click={() => this.append(data)} class="el-icon-plus" title="添加" />
            <i on-click={() => this.remove(node, data)} class="el-icon-delete" title="删除" />
          </span>
        </div>
      )
    },
    append(data) {
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      this.dialogVisible = true
      this.currentNode = data.children
    },
    remove(node, data) {
      const { parent } = node
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    },
    addNode(data) {
      this.currentNode.push(data)
    },
    setOptionValue(item, val) {
      let res = isNumberStr(val) ? +val : val
      item.label = res
      item.value = res
    },
    setOptionDescribe(item, val) {
      let res = isNumberStr(val) ? +val : val
      item.describe = res
      this.$forceUpdate()
    },
    setDefaultValue(val) {
      if (Array.isArray(val)) {
        return val.join(',')
      }
      if (['string', 'number'].indexOf(val) > -1) {
        return val
      }
      if (typeof val === 'boolean') {
        return `${val}`
      }
      return val
    },
    onDefaultValueInput(str) {
      if (isArray(this.activeData.defaultValue)) {
        // 数组
        this.$set(this.activeData, 'defaultValue', str.split(',').map(val => (isNumberStr(val) ? +val : val)))
      } else if (['true', 'false'].indexOf(str) > -1) {
        // 布尔
        this.$set(this.activeData, 'defaultValue', JSON.parse(str))
      } else {
        // 字符串和数字
        this.$set(this.activeData, 'defaultValue', isNumberStr(str) ? +str : str)
      }
    },
    onSwitchValueInput(val, name) {
      if (['true', 'false'].indexOf(val) > -1) {
        this.$set(this.activeData, name, JSON.parse(val))
      } else {
        this.$set(this.activeData, name, isNumberStr(val) ? +val : val)
      }
    },
    setTimeValue(val, type) {
      const valueFormat = type === 'week' ? dateTimeFormat.date : val
      this.$set(this.activeData, 'defaultValue', null)
      this.$set(this.activeData, 'value-format', valueFormat)
      this.$set(this.activeData, 'format', val)
    },
    spanChange(val) {
      // this.formConf.span = val;
    },
    multipleChange(val) {
      this.$set(this.activeData, 'defaultValue', val ? [] : '')
    },
    dateTypeChange(val) {
      this.setTimeValue(dateTimeFormat[val], val)
    },
    rangeChange(val) {
      this.$set(this.activeData, 'defaultValue', val ? [this.activeData.min, this.activeData.max] : this.activeData.min)
    },
    rateTextChange(val) {
      if (val) this.activeData['show-score'] = false
    },
    rateScoreChange(val) {
      if (val) this.activeData['show-text'] = false
    },
    colorFormatChange(val) {
      this.activeData.defaultValue = null
      this.activeData['show-alpha'] = val.indexOf('a') > -1
      this.activeData.renderKey = this.activeData.formId + new Date().getTime() // 更新renderKey,重新渲染该组件
    },
    openIconsDialog(model) {
      this.iconsVisible = true
      this.currentIconModel = model
    },
    setIcon(val) {
      this.activeData[this.currentIconModel] = val
    },
    tagChange(tagIcon) {
      let target = inputComponents.find(item => item.tagIcon === tagIcon)
      if (!target) target = selectComponents.find(item => item.tagIcon === tagIcon)
      this.$emit('tag-change', target)
    }
  }
}
</script>

<style lang="stylus" scoped>
.right-board {
  border-left: 1px solid #f1e8e8;
  width: 350px;
  position: absolute;
  right: 0;
  top: 0;
  padding-top: 3px;

  .field-box {
    position: relative;
    height: calc(100vh - 42px - 24px);
    box-sizing: border-box;
    overflow: hidden;
  }

  .el-scrollbar {
   height: calc(100% - 150px);
  }
}

.select-item {
  display: flex;
  align-items: center;
  border: 1px dashed #fff;
  box-sizing: border-box;

  & .close-btn {
    cursor: pointer;
    color: #f56c6c;
  }

  & .el-input + .el-input {
    margin-left: 4px;
  }
}

.select-item + .select-item {
  margin-top: 4px;
}

.select-item.sortable-chosen {
  border: 1px dashed #19a97b;
}

.select-line-icon {
  line-height: 32px;
  font-size: 22px;
  padding: 0 4px;
  color: #777;
}

.option-drag {
  cursor: move;
}

.time-range {
  .el-date-editor {
    width: 227px;
  }

  ::v-deep .el-icon-time {
    display: none;
  }
}

.document-link {
  position: absolute;
  display: block;
  width: 26px;
  height: 26px;
  top: 0;
  left: 0;
  cursor: pointer;
  background: #19a97b;
  z-index: 1;
  border-radius: 0 0 6px 0;
  text-align: center;
  line-height: 26px;
  color: #fff;
  font-size: 18px;
}

.node-label {
  font-size: 14px;
}

.node-icon {
  color: #bebfc3;
}

.calc-btn{
  padding: 4px 8px;
  margin:0 6px;
  background: #e5e5e5;
  cursor: pointer;
  &.error{
    background: #f56c6c;
    color: white;
  }
  &:hover{
    background: #f5f5f5;
  }
}

.pane-calc-preview{
  padding: 0 10px;
  cursor: pointer;min-height: 32px;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  font-size: 12px;
}
.calc-dialog{
  >>> .el-dialog__body{
    padding-top: 0;
  }
  .calc-box{
    font-size: 12px;
    line-height: 2
    .calc-tip{
      margin: 10px 0;
      font-size: 12px;
      color: #aaa;
    }

    .calc-preview{
      border: 1px solid #e5e5e5;
      border-radius: 4px;
      min-height: 60px;
      padding: 4px 10px;
      position: relative;

      &.error{
        border: 1px solid red;
      }

      .preview-actions{
        position: absolute;
        bottom: 0;
        right: 0;
        > i {
          font-size: 14px;
          margin-right: 8px;
          cursor: pointer;
          &:hover{
            color: red;
          }
        }
      }
    }
  }
}
</style>
<style lang="stylus">
.calc-dialog  .el-dialog__body{
  padding-top: 0;
  padding-bottom: 0;
}
</style>
