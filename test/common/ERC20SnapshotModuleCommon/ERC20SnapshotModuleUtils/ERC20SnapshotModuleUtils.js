const { BN } = require('@openzeppelin/test-helpers')
const getUnixTimestamp = () => {
  return Math.round(new Date().getTime() / 1000)
}

const timeout = function (ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function checkSnapshot (time, totalSupply, addresses, balances) {
  // Values before the snapshot
  (await this.cmtat.snapshotTotalSupply(time)).should.be.bignumber.equal(
    totalSupply
  )
  const result = await this.cmtat.methods[
    'snapshotInfoBatch(uint256,address[])'
  ](time, addresses)
  const times = [time]
  const result2 = await this.cmtat.methods[
    'snapshotInfoBatch(uint256[],address[])'
  ](times, addresses)
  for (let i = 0; i < balances.length; ++i) {
    (
      await this.cmtat.snapshotBalanceOf(time, addresses[i])
    ).should.be.bignumber.equal(balances[i])
    await this.cmtat.snapshotInfo(time, addresses[i])
    const { 0: ownerBalance, 1: totalSupplyGet } =
      await this.cmtat.snapshotInfo(time, addresses[i])
    // const [ownerBalance, totalSupplyGet]
    ownerBalance.should.be.bignumber.equal(balances[i])
    result[0][i].should.be.bignumber.equal(balances[i])
    result2[0][0][i].should.be.bignumber.equal(balances[i])
    totalSupplyGet.should.be.bignumber.equal(totalSupply)
  }
  result[1].should.be.bignumber.equal(totalSupply)
  result2[1][0].should.be.bignumber.equal(totalSupply)
}

async function checkArraySnapshot (snapshots, snapshotsValue) {
  for (let i = 0; i < snapshots.length; ++i) {
    snapshots[i].should.be.bignumber.equal(snapshotsValue[i])
  }
}
module.exports = {
  getUnixTimestamp,
  timeout,
  checkSnapshot,
  checkArraySnapshot
}
