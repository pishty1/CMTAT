const ERC20BurnModuleCommon = require('../../common/ERC20BurnModuleCommon')
const { deployCMTATStandalone } = require('../../deploymentUtils')
contract(
  'Standard - ERC20BurnModule',
  function ([_, admin, address1, address2, address3, deployerAddress]) {
    beforeEach(async function () {
      this.cmtat = await deployCMTATStandalone(_, admin, deployerAddress)
    })

    ERC20BurnModuleCommon(admin, address1, address2, address3)
  }
)
