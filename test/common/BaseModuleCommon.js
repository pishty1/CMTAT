const { expectEvent } = require('@openzeppelin/test-helpers')
const { DEFAULT_ADMIN_ROLE } = require('../utils')
const {
  expectRevertCustomError
} = require('../../openzeppelin-contracts-upgradeable/test/helpers/customError.js')
const { should } = require('chai').should()

function BaseModuleCommon (owner, address1, address2, address3, proxyTest) {
  context('Token structure', function () {
    it('testHasTheDefinedVersion', async function () {
      // Act + Assert
      (await this.cmtat.VERSION()).should.equal('2.4.0')
    })
    it('testHasTheDefinedTokenId', async function () {
      // Act + Assert
      (await this.cmtat.tokenId()).should.equal('CMTAT_ISIN')
    })
    it('testHasTheDefinedTerms', async function () {
      // Act + Assert
      (await this.cmtat.terms()).should.equal('https://cmta.ch')
    })
    it('testAdminCanChangeTokenId', async function () {
      // Arrange
      (await this.cmtat.tokenId()).should.equal('CMTAT_ISIN')
      // Act
      this.logs = await this.cmtat.setTokenId('CMTAT_TOKENID', { from: owner });
      // Assert
      (await this.cmtat.tokenId()).should.equal('CMTAT_TOKENID')
      expectEvent(this.logs, 'TokenId', {
        newTokenIdIndexed: web3.utils.sha3('CMTAT_TOKENID'),
        newTokenId: 'CMTAT_TOKENID'
      })
    })
    it('testCannotNonAdminChangeTokenId', async function () {
      // Arrange - Assert
      (await this.cmtat.tokenId()).should.equal('CMTAT_ISIN')
      // Act
      await expectRevertCustomError(
        this.cmtat.setTokenId('CMTAT_TOKENID', { from: address1 }),
        'AccessControlUnauthorizedAccount',
        [address1, DEFAULT_ADMIN_ROLE]
      );
      // Assert
      (await this.cmtat.tokenId()).should.equal('CMTAT_ISIN')
    })
    it('testAdminCanUpdateTerms', async function () {
      // Arrange - Assert
      (await this.cmtat.terms()).should.equal('https://cmta.ch')
      // Act
      this.logs = await this.cmtat.setTerms('https://cmta.ch/terms', {
        from: owner
      });
      // Assert
      (await this.cmtat.terms()).should.equal('https://cmta.ch/terms')
      expectEvent(this.logs, 'Term', {
        newTermIndexed: web3.utils.sha3('https://cmta.ch/terms'),
        newTerm: 'https://cmta.ch/terms'
      })
    })
    it('testCannotNonAdminUpdateTerms', async function () {
      // Arrange - Assert
      (await this.cmtat.terms()).should.equal('https://cmta.ch')
      // Act
      await expectRevertCustomError(
        this.cmtat.setTerms('https://cmta.ch/terms', { from: address1 }),
        'AccessControlUnauthorizedAccount',
        [address1, DEFAULT_ADMIN_ROLE]
      );
      // Assert
      (await this.cmtat.terms()).should.equal('https://cmta.ch')
    })
    it('testAdminCanUpdateInformation', async function () {
      // Arrange - Assert
      (await this.cmtat.information()).should.equal('CMTAT_info')
      // Act
      this.logs = await this.cmtat.setInformation('new info available', {
        from: owner
      });
      // Assert
      (await this.cmtat.information()).should.equal('new info available')
      expectEvent(this.logs, 'Information', {
        newInformationIndexed: web3.utils.sha3('new info available'),
        newInformation: 'new info available'
      })
    })
    it('testCannotNonAdminUpdateInformation', async function () {
      // Arrange - Assert
      (await this.cmtat.information()).should.equal('CMTAT_info')
      // Act
      await expectRevertCustomError(
        this.cmtat.setInformation('new info available', { from: address1 }),
        'AccessControlUnauthorizedAccount',
        [address1, DEFAULT_ADMIN_ROLE]
      );
      // Assert
      (await this.cmtat.information()).should.equal('CMTAT_info')
    })
    it('testAdminCanUpdateFlag', async function () {
      // Arrange - Assert
      (await this.cmtat.flag()).should.be.bignumber.equal(this.flag.toString())
      // Act
      this.logs = await this.cmtat.setFlag(100, { from: owner });
      // Assert
      (await this.cmtat.flag()).should.be.bignumber.equal('100')
      expectEvent(this.logs, 'Flag', {
        newFlag: '100'
      })
    })
    it('testAdminCanNotUpdateFlagWithTheSameValue', async function () {
      // Arrange - Assert
      (await this.cmtat.flag()).should.be.bignumber.equal(this.flag.toString())
      // Act
      await expectRevertCustomError(
        this.cmtat.setFlag(this.flag.toString(), { from: owner }),
        'CMTAT_BaseModule_SameValue',
        []
      )
    })
    it('testCannotNonAdminUpdateFlag', async function () {
      // Arrange - Assert
      (await this.cmtat.flag()).should.be.bignumber.equal(this.flag.toString())
      // Act
      await expectRevertCustomError(
        this.cmtat.setFlag(25, { from: address1 }),
        'AccessControlUnauthorizedAccount',
        [address1, DEFAULT_ADMIN_ROLE]
      );
      // Assert
      (await this.cmtat.flag()).should.be.bignumber.equal(this.flag.toString())
    })
  })
}
module.exports = BaseModuleCommon
