const CMTAT = artifacts.require('CMTATSnapshotStandaloneTest')
const SnapshotModuleCommonGlobal = require('../../common/SnapshotModuleCommon/global/SnapshotModuleMultiplePlannedTest')
const SnapshotModuleCommonRescheduling = require('../../common/SnapshotModuleCommon/SnapshotModuleCommonRescheduling')
const SnapshotModuleCommonScheduling = require('../../common/SnapshotModuleCommon/SnapshotModuleCommonScheduling')
const SnapshotModuleCommonUnschedule = require('../../common/SnapshotModuleCommon/SnapshotModuleCommonUnschedule')
const SnapshotModuleCommonGetNextSnapshot = require('../../common/SnapshotModuleCommon/SnapshotModuleCommonGetNextSnapshot')
const SnapshotModuleMultiplePlannedTest = require('../../common/SnapshotModuleCommon/global/SnapshotModuleMultiplePlannedTest')
const SnapshotModuleOnePlannedSnapshotTest = require('../../common/SnapshotModuleCommon/global/SnapshotModuleOnePlannedSnapshotTest')
const SnapshotModuleZeroPlannedSnapshotTest = require('../../common/SnapshotModuleCommon/global/SnapshotModuleZeroPlannedSnapshot')
const { ZERO_ADDRESS } = require('../../utils')
const DECIMAL = 0
contract(
  'Standard - SnapshotModule',
  function ([_, admin, address1, address2, address3, randomDeployer]) {
    beforeEach(async function () {
      this.flag = 5
      this.cmtat = await CMTAT.new(_, admin, 'CMTA Token', 'CMTAT', DECIMAL, 'CMTAT_ISIN', 'https://cmta.ch', ZERO_ADDRESS, 'CMTAT_info', this.flag, { from: randomDeployer })
    })
    SnapshotModuleMultiplePlannedTest(admin, address1, address2, address3)
   SnapshotModuleOnePlannedSnapshotTest(admin, address1, address2, address3)
    //SnapshotModuleZeroPlannedSnapshotTest(admin, address1, address2, address3)
    //SnapshotModuleCommonGlobal(admin, address1, address2, address3)
    SnapshotModuleCommonRescheduling(admin, address1, address2, address3)
    SnapshotModuleCommonScheduling(admin, address1, address2, address3)
  SnapshotModuleCommonUnschedule(admin, address1, address2, address3)
    //SnapshotModuleCommonUnschedule(admin, address1, address2, address3)
   SnapshotModuleCommonGetNextSnapshot(admin, address1, address2, address3)
  }
)