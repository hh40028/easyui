import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../views/login.vue'
import chanPinJieGouQingDan from '../views/product/chanPinJieGouQingDan.vue'
import index from '../views/index.vue'
import nav from '../views/nav.vue'
import emptyToNav from '../views/emptyToNav.vue'
import empty from '../views/empty.vue'
import selectCommodity from '../components/selectCommodity.vue'
import shangPinGuanLi from '../views/commodity/shangPinGuanLi.vue'
import warehouseSet from '../views/system/warehouseSet.vue'
import purchaseList from '../views/purchase/purchaseList.vue'
import contractList from '../views/contract/contractList.vue'
import customer from '../views/customerSupplier/customer.vue'
import supplier from '../views/customerSupplier/supplier.vue'
import saleorderList from '../views/sale/saleorderList.vue'
import stockQuery from '../views/stock/stockQuery.vue'
import orgSet from '../views/system/orgSet.vue'
import userSet from '../views/system/userSet.vue'
import equipmentList from '../views/equipment/equipmentList.vue'
import equipmentView from '../views/equipment/equipmentView.vue'
import directstorage from '../views/stock/directstorage.vue'
import userRoleSet from '../views/system/userRoleSet.vue'
import worksequenceList from '../views/product/worksequence/worksequenceList.vue'
import accountingsubjects from '../views/finance/accountingsubjects.vue'
import designManagement from '../views/product/designManagement.vue'
import customerBegin from '../views/customerSupplier/customerBegin.vue'
import supplierBegin from '../views/customerSupplier/supplierBegin.vue'
import receiptOrder from '../views/finance/receiptOrder.vue'
import paymentOrder from '../views/finance/paymentOrder.vue'
import recePayStatistics from '../views/finance/recePayStatistics.vue'
import outboundList from '../views/stock/outboundList.vue'
import shengChanJiHua from '../views/product/shengChanJiHua.vue'
import workorderList from '../views/product/workorderList.vue'
import ExternalWorkorderList from '../views/product/ExternalWorkorderList.vue'
import inboundList from '../views/stock/inboundList.vue'
import purchaseplan from '../views/purchase/purchaseplan.vue'
import caiGouDingDan from '../views/purchase/caiGouDingDan.vue'
import lingLiaoDan from '../views/product/lingLiaoDan.vue'
import ganttView from '../views/gantt/ganttView.vue'
import dictSet from '../views/system/dictSet.vue'
import yanShouDan from '../views/product/yanShouDan.vue'
import gongXuYiJiaoDan from '../views/product/gongXuYiJiaoDan.vue'
import productionInboundList from '../views/stock/productionInboundList.vue'
import calendarSet from '../views/system/calendarSet.vue'

Vue.use(VueRouter)

const routes = [
  {path: '/', name: 'index', component: index},
  {path: '/index', name: 'index', component: index},
  {path: '/login', name: 'login', component: login},
  {path: '/emptyToNav', name: 'emptyToNav', component: emptyToNav},
  {path: '/chanPinJieGouQingDan', name: 'chanPinJieGouQingDan', component: chanPinJieGouQingDan},
  {path: '/empty', name: 'empty', component: empty},
  {path: '/nav', name: 'nav', component: nav},
  {path: '/selectCommodity', name: 'selectCommodity', component: selectCommodity},
  {path: '/shangPinGuanLi', name: 'shangPinGuanLi', component: shangPinGuanLi},
  {path: '/warehouseSet', name: 'warehouseSet', component: warehouseSet},
  {path: '/purchaseList', name: 'purchaseList', component: purchaseList},
  {path: '/contractList', name: 'contractList', component: contractList},
  {path: '/customer', name: 'customer', component: customer},
  {path: '/supplier', name: 'supplier', component: supplier},
  {path: '/saleorder', name: 'saleorderList', component: saleorderList},
  {path: '/stockQuery', name: 'stockQuery', component: stockQuery},
  {path: '/orgSet', name: 'orgSet', component: orgSet},
  {path: '/userSet', name: 'userSet', component: userSet},
  {path: '/equipmentList', name: 'equipmentList', component: equipmentList},
  {path: '/equipmentView', name: 'equipmentView', component: equipmentView},
  {path: '/directstorage', name: 'directstorage', component: directstorage},
  {path: '/userRoleSet', name: 'userRoleSet', component: userRoleSet},
  {path: '/worksequenceList', name: 'worksequenceList', component: worksequenceList},
  {path: '/accountingsubjects', name: 'accountingsubjects', component: accountingsubjects},
  {path: '/designManagement', name: 'designManagement', component: designManagement},
  {path: '/customerBegin', name: 'customerBegin', component: customerBegin},
  {path: '/supplierBegin', name: 'supplierBegin', component: supplierBegin},
  {path: '/receiptOrder', name: 'receiptOrder', component: receiptOrder},
  {path: '/paymentOrder', name: 'paymentOrder', component: paymentOrder},
  {path: '/recePayStatistics', name: 'recePayStatistics', component: recePayStatistics},
  {path: '/outboundList', name: 'outboundList', component: outboundList},
  {path: '/shengChanJiHua', name: 'shengChanJiHua', component: shengChanJiHua},
  {path: '/jiaGongDan', name: 'workorderList', component: workorderList},
  {path: '/ruKuDan', name: 'inboundList', component: inboundList},
  {path: '/weiWaiJiaGongDan', name: 'ExternalWorkorderList', component: ExternalWorkorderList},
  {path: '/purchaseplan', name: 'purchaseplan', component: purchaseplan},
  {path: '/caiGouDingDan', name: 'caiGouDingDan', component: caiGouDingDan},
  {path: '/lingLiaoDan', name: 'lingLiaoDan', component: lingLiaoDan},
  {path: '/ganttView', name: 'ganttView', component: ganttView},
  {path: '/dictSet', name: 'dictSet', component: dictSet},
  {path: '/yanShouDan', name: 'yanShouDan', component: yanShouDan},
  {path: '/gongXuYiJiaoDan', name: 'gongXuYiJiaoDan', component: gongXuYiJiaoDan},
  {path: '/shengChanRuKu', name: 'productionInboundList', component: productionInboundList},
  {path: '/calendarSet', name: 'calendarSet', component: calendarSet},
]

const router = new VueRouter({
  routes
})

export default router
