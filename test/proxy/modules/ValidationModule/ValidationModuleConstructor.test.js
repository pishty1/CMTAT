const ValidationModuleCommon = require('../../../common/ValidationModule/ValidationModuleCommon')
const { deployCMTATProxyWithParameter } = require('../../../deploymentUtils')
const { ZERO_ADDRESS } = require('../../../utils')
const RuleEngineMock = artifacts.require('RuleEngineMock')
const ADDRESS1_INITIAL_BALANCE = 17
const ADDRESS2_INITIAL_BALANCE = 18
const ADDRESS3_INITIAL_BALANCE = 19

contract(
  'Proxy - ValidationModule - Constructor',
  function ([_, admin, address1, address2, address3, deployerAddress]) {
    beforeEach(async function () {
      this.flag = 5
      const DECIMAL = 0
      this.ruleEngineMock = await RuleEngineMock.new({ from: admin })
      this.cmtat = await deployCMTATProxyWithParameter(
        deployerAddress,
        _,
        admin,
        ZERO_ADDRESS,
        'CMTA Token',
        'CMTAT',
        DECIMAL,
        'CMTAT_ISIN',
        'https://cmta.ch',
        this.ruleEngineMock.address,
        'CMTAT_info',
        this.flag
      )
      await this.cmtat.mint(address1, ADDRESS1_INITIAL_BALANCE, {
        from: admin
      })
      await this.cmtat.mint(address2, ADDRESS2_INITIAL_BALANCE, {
        from: admin
      })
      await this.cmtat.mint(address3, ADDRESS3_INITIAL_BALANCE, {
        from: admin
      })
    })
    ValidationModuleCommon(
      admin,
      address1,
      address2,
      address3,
      ADDRESS1_INITIAL_BALANCE,
      ADDRESS2_INITIAL_BALANCE,
      ADDRESS3_INITIAL_BALANCE
    )
  }
)
