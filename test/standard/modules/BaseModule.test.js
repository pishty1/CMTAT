const CMTAT = artifacts.require('CMTAT')
const BaseModuleCommon = require('../../common/BaseModuleCommon')

contract(
  'Standard - BaseModule',
  function ([_, admin, address1, address2, address3]) {
    beforeEach(async function () {
      this.flag = 5
      this.cmtat = await CMTAT.new(_, false, admin, 'CMTA Token', 'CMTAT', 'CMTAT_ISIN', 'https://cmta.ch', 'CMTAT_info', this.flag, { from: admin })
    })

    BaseModuleCommon(admin, address1, address2, address3, false)
  }
)
