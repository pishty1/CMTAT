const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers')
const {
  expectRevertCustomError
} = require('../../openzeppelin-contracts-upgradeable/test/helpers/customError')
const { should } = require('chai').should()

function ERC20BaseModuleCommon (admin, address1, address2, address3, proxyTest) {
  context('Token structure', function () {
    it('testHasTheDefinedName', async function () {
      // Act + Assert
      (await this.cmtat.name()).should.equal('CMTA Token')
    })
    it('testHasTheDefinedSymbol', async function () {
      // Act + Assert
      (await this.cmtat.symbol()).should.equal('CMTAT')
    })
    it('testDecimalsEqual0', async function () {
      // Act + Assert
      (await this.cmtat.decimals()).should.be.bignumber.equal('0')
    })
  })

  context('Balance', function () {
    const TOKEN_AMOUNTS = [BN(31), BN(32), BN(33)]
    const TOKEN_INITIAL_SUPPLY = TOKEN_AMOUNTS.reduce((a, b) => {
      return a.add(b)
    })
    beforeEach(async function () {
      await this.cmtat.mint(address1, TOKEN_AMOUNTS[0], { from: admin })
      await this.cmtat.mint(address2, TOKEN_AMOUNTS[1], { from: admin })
      await this.cmtat.mint(address3, TOKEN_AMOUNTS[2], { from: admin })
    })
    it('testHasTheCorrectBalanceInfo', async function () {
      // Act + Assert
      // Assert
      const ADDRESSES = [address1, address2, address3]
      let result = await this.cmtat.balanceInfo(ADDRESSES)
      result[0][0].should.be.bignumber.equal(TOKEN_AMOUNTS[0])
      result[0][1].should.be.bignumber.equal(TOKEN_AMOUNTS[1])
      result[1].should.be.bignumber.equal(TOKEN_INITIAL_SUPPLY)

      const ADDRESSES2 = []
      result = await this.cmtat.balanceInfo(ADDRESSES2)
      BN(result[0].length).should.be.bignumber.equal(BN(0))
      result[1].should.be.bignumber.equal(TOKEN_INITIAL_SUPPLY)
    })
  })

  context('Allowance', function () {
    // address1 -> address3
    it('testApproveAllowance', async function () {
      const AMOUNT_TO_APPROVE = BN(20);
      // Arrange - Assert
      (
        await this.cmtat.allowance(address1, address3)
      ).should.be.bignumber.equal('0')
      // Act
      this.logs = await this.cmtat.approve(address3, AMOUNT_TO_APPROVE, {
        from: address1
      });
      // Assert
      (
        await this.cmtat.allowance(address1, address3)
      ).should.be.bignumber.equal(AMOUNT_TO_APPROVE)
      // emits an Approval event
      expectEvent(this.logs, 'Approval', {
        owner: address1,
        spender: address3,
        value: AMOUNT_TO_APPROVE
      })
    })

    // ADDRESS1 -> ADDRESS3
    it('testRedefinedAllowanceWithApprove', async function () {
      const AMOUNT_TO_APPROVE = BN(50)
      const FIRST_AMOUNT_TO_APPROVE = BN(20);
      // Arrange
      (
        await this.cmtat.allowance(address1, address3)
      ).should.be.bignumber.equal('0')
      await this.cmtat.approve(address3, FIRST_AMOUNT_TO_APPROVE, {
        from: address1
      });
      // Arrange - Assert
      (
        await this.cmtat.allowance(address1, address3)
      ).should.be.bignumber.equal(FIRST_AMOUNT_TO_APPROVE)
      // Act
      this.logs = await this.cmtat.approve(address3, AMOUNT_TO_APPROVE, {
        from: address1
      });
      // Assert
      (
        await this.cmtat.allowance(address1, address3)
      ).should.be.bignumber.equal(AMOUNT_TO_APPROVE)
      // emits an Approval event
      expectEvent(this.logs, 'Approval', {
        owner: address1,
        spender: address3,
        value: AMOUNT_TO_APPROVE
      })
    })
  })

  context('Transfer', function () {
    const TOKEN_AMOUNTS = [BN(31), BN(32), BN(33)]
    const TOKEN_INITIAL_SUPPLY = TOKEN_AMOUNTS.reduce((a, b) => {
      return a.add(b)
    })
    beforeEach(async function () {
      await this.cmtat.mint(address1, TOKEN_AMOUNTS[0], { from: admin })
      await this.cmtat.mint(address2, TOKEN_AMOUNTS[1], { from: admin })
      await this.cmtat.mint(address3, TOKEN_AMOUNTS[2], { from: admin })
    })

    it('testTransferFromOneAccountToAnother', async function () {
      const AMOUNT_TO_TRANSFER = BN(11)
      // Act
      this.logs = await this.cmtat.transfer(address2, AMOUNT_TO_TRANSFER, {
        from: address1
      });
      // Assert
      (await this.cmtat.balanceOf(address1)).should.be.bignumber.equal(
        TOKEN_AMOUNTS[0].sub(AMOUNT_TO_TRANSFER)
      );
      (await this.cmtat.balanceOf(address2)).should.be.bignumber.equal(
        TOKEN_AMOUNTS[1].add(AMOUNT_TO_TRANSFER)
      );
      (await this.cmtat.balanceOf(address3)).should.be.bignumber.equal(
        TOKEN_AMOUNTS[2]
      );
      (await this.cmtat.totalSupply()).should.be.bignumber.equal(
        TOKEN_INITIAL_SUPPLY
      )
      // emits a Transfer event
      expectEvent(this.logs, 'Transfer', {
        from: address1,
        to: address2,
        value: AMOUNT_TO_TRANSFER
      })
    })

    // ADDRESS1 -> ADDRESS2
    it('testCannotTransferMoreTokensThanOwn', async function () {
      const ADDRESS1_BALANCE = await this.cmtat.balanceOf(address1)
      const AMOUNT_TO_TRANSFER = BN(50)
      // Act
      await expectRevertCustomError(
        this.cmtat.transfer(address2, AMOUNT_TO_TRANSFER, { from: address1 }),
        'ERC20InsufficientBalance',
        [address1, ADDRESS1_BALANCE, AMOUNT_TO_TRANSFER]
      )
    })

    // allows address3 to transfer tokens from address1 to address2 with the right allowance
    // ADDRESS3 : ADDRESS1 -> ADDRESS2
    it('testTransferByAnotherAccountWithTheRightAllowance', async function () {
      const AMOUNT_TO_TRANSFER = BN(11)
      const AMOUNT_TO_APPROVE = 20
      // Arrange
      await this.cmtat.approve(address3, AMOUNT_TO_APPROVE, { from: address1 })
      // Act
      // Transfer
      this.logs = await this.cmtat.transferFrom(address1, address2, 11, {
        from: address3
      });
      // Assert
      (await this.cmtat.balanceOf(address1)).should.be.bignumber.equal(
        TOKEN_AMOUNTS[0].sub(AMOUNT_TO_TRANSFER)
      );
      (await this.cmtat.balanceOf(address2)).should.be.bignumber.equal(
        TOKEN_AMOUNTS[1].add(AMOUNT_TO_TRANSFER)
      );
      (await this.cmtat.balanceOf(address3)).should.be.bignumber.equal(
        TOKEN_AMOUNTS[2]
      );
      (await this.cmtat.totalSupply()).should.be.bignumber.equal(
        TOKEN_INITIAL_SUPPLY
      )

      // emits a Transfer event
      expectEvent(this.logs, 'Transfer', {
        from: address1,
        to: address2,
        value: AMOUNT_TO_TRANSFER
      })
      // emits a Spend event
      expectEvent(this.logs, 'Spend', {
        owner: address1,
        spender: address3,
        value: AMOUNT_TO_TRANSFER
      })
    })

    // reverts if address3 transfers more tokens than the allowance from address1 to address2
    it('testCannotTransferByAnotherAccountWithInsufficientAllowance', async function () {
      const AMOUNT_TO_TRANSFER = BN(31)
      const ALLOWANCE_FOR_ADDRESS3 = BN(20);
      // Arrange
      // Define allowance
      (
        await this.cmtat.allowance(address1, address3)
      ).should.be.bignumber.equal('0')
      await this.cmtat.approve(address3, ALLOWANCE_FOR_ADDRESS3, {
        from: address1
      });
      // Arrange - Assert
      (
        await this.cmtat.allowance(address1, address3)
      ).should.be.bignumber.equal(ALLOWANCE_FOR_ADDRESS3)
      // Act
      // Transfer
      await expectRevertCustomError(
        this.cmtat.transferFrom(address1, address2, 31, { from: address3 }),
        'ERC20InsufficientAllowance',
        [address3, ALLOWANCE_FOR_ADDRESS3, AMOUNT_TO_TRANSFER]
      )
    })

    // reverts if address3 transfers more tokens than address1 owns from address1 to address2
    it('testCannotTransferByAnotherAccountWithInsufficientBalance', async function () {
      // Arrange
      const AMOUNT_TO_TRANSFER = BN(50)
      const ADDRESS1_BALANCE = await this.cmtat.balanceOf(address1)
      await this.cmtat.approve(address3, 1000, { from: address1 })
      // Act
      await expectRevertCustomError(
        this.cmtat.transferFrom(address1, address2, AMOUNT_TO_TRANSFER, {
          from: address3
        }),
        'ERC20InsufficientBalance',
        [address1, ADDRESS1_BALANCE, AMOUNT_TO_TRANSFER]
      )
    })
  })

  context('transferFrom', function () {
    const TOKEN_AMOUNTS = [BN(31), BN(32), BN(33)]
    const TOKEN_INITIAL_SUPPLY = TOKEN_AMOUNTS.reduce((a, b) => {
      return a.add(b)
    })
    beforeEach(async function () {
      await this.cmtat.mint(address1, TOKEN_AMOUNTS[0], { from: admin })
      await this.cmtat.mint(address2, TOKEN_AMOUNTS[1], { from: admin })
      await this.cmtat.mint(address3, TOKEN_AMOUNTS[2], { from: admin })
    })

    it('testTransferFromOneAccountToAnother', async function () {
      const AMOUNT_TO_TRANSFER = BN(11)
      // Act
      this.logs = await this.cmtat.transfer(address2, AMOUNT_TO_TRANSFER, {
        from: address1
      });
      // Assert
      (await this.cmtat.balanceOf(address1)).should.be.bignumber.equal(
        TOKEN_AMOUNTS[0].sub(AMOUNT_TO_TRANSFER)
      );
      (await this.cmtat.balanceOf(address2)).should.be.bignumber.equal(
        TOKEN_AMOUNTS[1].add(AMOUNT_TO_TRANSFER)
      );
      (await this.cmtat.balanceOf(address3)).should.be.bignumber.equal(
        TOKEN_AMOUNTS[2]
      );
      (await this.cmtat.totalSupply()).should.be.bignumber.equal(
        TOKEN_INITIAL_SUPPLY
      )
      // emits a Transfer event
      expectEvent(this.logs, 'Transfer', {
        from: address1,
        to: address2,
        value: AMOUNT_TO_TRANSFER
      })
    })

    // ADDRESS1 -> ADDRESS2
    it('testCannotTransferMoreTokensThanOwn', async function () {
      const ADDRESS1_BALANCE = await this.cmtat.balanceOf(address1)
      const AMOUNT_TO_TRANSFER = BN(50)
      // Act
      await expectRevertCustomError(
        this.cmtat.transfer(address2, AMOUNT_TO_TRANSFER, { from: address1 }),
        'ERC20InsufficientBalance',
        [address1, ADDRESS1_BALANCE, AMOUNT_TO_TRANSFER]
      )
    })
  })

  context('transferBatch', function () {
    const TOKEN_ADDRESS_TOS = [address1, address2, address3]
    const TOKEN_AMOUNTS = [BN(10), BN(100), BN(1000)]

    beforeEach(async function () {
      // Only the admin has tokens
      await this.cmtat.mint(
        admin,
        TOKEN_AMOUNTS.reduce((a, b) => {
          return a.add(b)
        }),
        { from: admin }
      )
    })

    it('testTransferBatch', async function () {
      // Act
      this.logs = await this.cmtat.transferBatch(
        TOKEN_ADDRESS_TOS,
        TOKEN_AMOUNTS,
        {
          from: admin
        }
      )
      // Assert
      for (let i = 0; i < TOKEN_ADDRESS_TOS.length; ++i) {
        (
          await this.cmtat.balanceOf(TOKEN_ADDRESS_TOS[i])
        ).should.be.bignumber.equal(TOKEN_AMOUNTS[i])
      }
      // emits a Transfer event
      for (let i = 0; i < TOKEN_ADDRESS_TOS.length; ++i) {
        expectEvent(this.logs, 'Transfer', {
          from: admin,
          to: TOKEN_ADDRESS_TOS[i],
          value: TOKEN_AMOUNTS[i]
        })
      }
    })

    // ADDRESS1 -> ADDRESS2
    it('testCannotTransferBatchMoreTokensThanOwn', async function () {
      const BALANCE_AFTER_FIRST_TRANSFER = (
        await this.cmtat.balanceOf(admin)
      ).sub(TOKEN_AMOUNTS[0])
      const AMOUNT_TO_TRANSFER_SECOND = BALANCE_AFTER_FIRST_TRANSFER.add(BN(1))
      // Second amount is invalid
      const TOKEN_AMOUNTS_INVALID = [
        TOKEN_AMOUNTS[0],
        AMOUNT_TO_TRANSFER_SECOND,
        TOKEN_AMOUNTS[2]
      ]
      // Act
      await expectRevertCustomError(
        this.cmtat.transferBatch(TOKEN_ADDRESS_TOS, TOKEN_AMOUNTS_INVALID, {
          from: admin
        }),
        'ERC20InsufficientBalance',
        [admin, BALANCE_AFTER_FIRST_TRANSFER, AMOUNT_TO_TRANSFER_SECOND]
      )
    })

    it('testCannotTransferBatchIfLengthMismatchMissingAddresses', async function () {
      // Number of addresses is insufficient
      const TOKEN_ADDRESS_TOS_INVALID = [address1, address2]
      await expectRevertCustomError(
        this.cmtat.transferBatch(TOKEN_ADDRESS_TOS_INVALID, TOKEN_AMOUNTS, {
          from: admin
        }),
        'CMTAT_ERC20BaseModule_TosValueslengthMismatch',
        []
      )
    })

    it('testCannotTransferBatchIfLengthMismatchTooManyAddresses', async function () {
      // There are too many addresses
      const TOKEN_ADDRESS_TOS_INVALID = [
        address1,
        address2,
        address1,
        address1
      ]
      await expectRevertCustomError(
        this.cmtat.transferBatch(TOKEN_ADDRESS_TOS_INVALID, TOKEN_AMOUNTS, {
          from: admin
        }),
        'CMTAT_ERC20BaseModule_TosValueslengthMismatch',
        []
      )
    })

    it('testCannotTransferBatchIfTOSIsEmpty', async function () {
      const TOKEN_ADDRESS_TOS_INVALID = []
      await expectRevertCustomError(
        this.cmtat.transferBatch(TOKEN_ADDRESS_TOS_INVALID, TOKEN_AMOUNTS, {
          from: admin
        }),
        'CMTAT_ERC20BaseModule_EmptyTos',
        []
      )
    })
  })
}
module.exports = ERC20BaseModuleCommon
