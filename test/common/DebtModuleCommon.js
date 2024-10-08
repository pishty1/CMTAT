const { expectEvent, BN } = require('@openzeppelin/test-helpers')
const {
  expectRevertCustomError
} = require('../../openzeppelin-contracts-upgradeable/test/helpers/customError.js')
const { DEBT_ROLE } = require('../utils')
const { should } = require('chai').should()

function BaseModuleCommon (owner, attacker) {
  context('AdminSetDebt', function () {
    it('testAdminCanSetDebt', async function () {
      const INTEREST_RATE = BN(1)
      const ParValue = BN(2);
      // Arrange
      (await this.cmtat.debt()).guarantor.should.equal('');
      (await this.cmtat.debt()).bondHolder.should.equal('');
      (await this.cmtat.debt()).maturityDate.should.equal('');
      (await this.cmtat.debt()).interestRate.should.be.bignumber.equal('0');
      (await this.cmtat.debt()).parValue.should.be.bignumber.equal('0');
      (await this.cmtat.debt()).interestScheduleFormat.should.equal('');
      (await this.cmtat.debt()).interestPaymentDate.should.equal('');
      (await this.cmtat.debt()).dayCountConvention.should.equal('');
      (await this.cmtat.debt()).businessDayConvention.should.equal('');
      (await this.cmtat.debt()).publicHolidaysCalendar.should.equal('');
      (await this.cmtat.debt()).issuanceDate.should.equal('');
      (await this.cmtat.debt()).couponFrequency.should.equal('')

      // Act
      this.logs = await this.cmtat.setDebt(
        {
          interestRate: INTEREST_RATE.toString(),
          parValue: ParValue.toString(),
          guarantor: 'guarantor',
          bondHolder: 'bondHolder',
          maturityDate: 'maturityDate',
          interestScheduleFormat: 'interestScheduleFormat',
          interestPaymentDate: 'interestPaymentDate',
          dayCountConvention: 'dayCountConvention',
          businessDayConvention: 'businessDayConvention',
          publicHolidaysCalendar: 'publicHolidaysCalendar',
          issuanceDate: 'issuanceDate',
          couponFrequency: 'couponFrequency'
        },
        { from: owner }
      );
      // Assert
      // Value
      (await this.cmtat.debt()).interestRate.should.be.bignumber.equal(
        INTEREST_RATE
      );
      (await this.cmtat.debt()).parValue.should.be.bignumber.equal(ParValue);
      (await this.cmtat.debt()).guarantor.should.equal('guarantor');
      (await this.cmtat.debt()).bondHolder.should.equal('bondHolder');
      (await this.cmtat.debt()).maturityDate.should.equal('maturityDate');
      (await this.cmtat.debt()).interestScheduleFormat.should.equal(
        'interestScheduleFormat'
      );
      (await this.cmtat.debt()).interestPaymentDate.should.equal(
        'interestPaymentDate'
      );
      (await this.cmtat.debt()).dayCountConvention.should.equal(
        'dayCountConvention'
      );
      (await this.cmtat.debt()).businessDayConvention.should.equal(
        'businessDayConvention'
      );
      (await this.cmtat.debt()).publicHolidaysCalendar.should.equal(
        'publicHolidaysCalendar'
      );
      (await this.cmtat.debt()).issuanceDate.should.equal('issuanceDate');
      (await this.cmtat.debt()).couponFrequency.should.equal('couponFrequency')

      // events
      expectEvent(this.logs, 'InterestRate', {
        newInterestRate: INTEREST_RATE
      })
      expectEvent(this.logs, 'ParValue', {
        newParValue: ParValue
      })
      expectEvent(this.logs, 'Guarantor', {
        newGuarantorIndexed: web3.utils.sha3('guarantor'),
        newGuarantor: 'guarantor'
      })
      expectEvent(this.logs, 'BondHolder', {
        newBondHolderIndexed: web3.utils.sha3('bondHolder'),
        newBondHolder: 'bondHolder'
      })
      expectEvent(this.logs, 'MaturityDate', {
        newMaturityDateIndexed: web3.utils.sha3('maturityDate'),
        newMaturityDate: 'maturityDate'
      })
      expectEvent(this.logs, 'InterestScheduleFormat', {
        newInterestScheduleFormatIndexed: web3.utils.sha3(
          'interestScheduleFormat'
        ),
        newInterestScheduleFormat: 'interestScheduleFormat'
      })
      expectEvent(this.logs, 'InterestPaymentDate', {
        newInterestPaymentDateIndexed: web3.utils.sha3('interestPaymentDate'),
        newInterestPaymentDate: 'interestPaymentDate'
      })
      expectEvent(this.logs, 'DayCountConvention', {
        newDayCountConventionIndexed: web3.utils.sha3('dayCountConvention'),
        newDayCountConvention: 'dayCountConvention'
      })
      expectEvent(this.logs, 'BusinessDayConvention', {
        newBusinessDayConventionIndexed: web3.utils.sha3(
          'businessDayConvention'
        ),
        newBusinessDayConvention: 'businessDayConvention'
      })
      expectEvent(this.logs, 'PublicHolidaysCalendar', {
        newPublicHolidaysCalendarIndexed: web3.utils.sha3(
          'publicHolidaysCalendar'
        ),
        newPublicHolidaysCalendar: 'publicHolidaysCalendar'
      })
      expectEvent(this.logs, 'IssuanceDate', {
        newIssuanceDateIndexed: web3.utils.sha3('issuanceDate'),
        newIssuanceDate: 'issuanceDate'
      })
      expectEvent(this.logs, 'CouponFrequency', {
        newCouponFrequencyIndexed: web3.utils.sha3('couponFrequency'),
        newCouponFrequency: 'couponFrequency'
      })
    })

    it('testAdminCanSetInterestRate', async function () {
      // Arrange
      (await this.cmtat.debt()).interestRate.should.be.bignumber.equal('0')
      // Act
      this.logs = await this.cmtat.setInterestRate(7, { from: owner });
      // Assert
      (await this.cmtat.debt()).interestRate.should.be.bignumber.equal('7')
      expectEvent(this.logs, 'InterestRate', {
        newInterestRate: '7'
      })
    })

    it('testAdminCanNotSetInterestRateWithTheSameValue', async function () {
      // Arrange
      (await this.cmtat.debt()).interestRate.should.be.bignumber.equal('0')
      // Act + Assert
      await expectRevertCustomError(
        this.cmtat.setInterestRate(0, { from: owner }),
        'CMTAT_DebtModule_SameValue',
        []
      )
    })

    it('testAdminCanSetParValue', async function () {
      // Arrange
      (await this.cmtat.debt()).parValue.should.be.bignumber.equal('0')
      // Act
      this.logs = await this.cmtat.setParValue(7, { from: owner });
      // Assert
      (await this.cmtat.debt()).parValue.should.be.bignumber.equal('7')
      expectEvent(this.logs, 'ParValue', {
        newParValue: '7'
      })
    })

    it('testAdminCanNotSetParValueWithTheSameValue', async function () {
      // Arrange
      (await this.cmtat.debt()).parValue.should.be.bignumber.equal('0')
      // Act + Assert
      await expectRevertCustomError(
        this.cmtat.setParValue(0, { from: owner }),
        'CMTAT_DebtModule_SameValue',
        []
      )
    })

    it('testAdminCanSetGuarantor', async function () {
      // Arrange
      (await this.cmtat.debt()).guarantor.should.equal('')
      // Act
      this.logs = await this.cmtat.setGuarantor('Test', { from: owner });
      // Assert
      (await this.cmtat.debt()).guarantor.should.equal('Test')
      expectEvent(this.logs, 'Guarantor', {
        newGuarantorIndexed: web3.utils.sha3('Test'),
        newGuarantor: 'Test'
      })
    })

    it('testAdminCanSetBonHolder', async function () {
      // Arrange
      (await this.cmtat.debt()).bondHolder.should.equal('')
      // Act
      this.logs = await this.cmtat.setBondHolder('Test', { from: owner });
      // Assert
      (await this.cmtat.debt()).bondHolder.should.equal('Test')
      expectEvent(this.logs, 'BondHolder', {
        newBondHolderIndexed: web3.utils.sha3('Test'),
        newBondHolder: 'Test'
      })
    })

    it('testAdminCanSetMaturityDate', async function () {
      // Arrange
      (await this.cmtat.debt()).maturityDate.should.equal('')
      // Act
      this.logs = await this.cmtat.setMaturityDate('Test', { from: owner });
      // Assert
      (await this.cmtat.debt()).maturityDate.should.equal('Test')
      expectEvent(this.logs, 'MaturityDate', {
        newMaturityDateIndexed: web3.utils.sha3('Test'),
        newMaturityDate: 'Test'
      })
    })

    it('testAdminCanSetInterestScheduleFormat', async function () {
      // Arrange
      (await this.cmtat.debt()).interestScheduleFormat.should.equal('')
      // Act
      this.logs = await this.cmtat.setInterestScheduleFormat('Test', {
        from: owner
      });
      // Assert
      (await this.cmtat.debt()).interestScheduleFormat.should.equal('Test')
      expectEvent(this.logs, 'InterestScheduleFormat', {
        newInterestScheduleFormatIndexed: web3.utils.sha3('Test'),
        newInterestScheduleFormat: 'Test'
      })
    })

    it('testAdminCanSetInterestPaymentDate', async function () {
      // Arrange
      (await this.cmtat.debt()).interestPaymentDate.should.equal('')
      // Act
      this.logs = await this.cmtat.setInterestPaymentDate('Test', {
        from: owner
      });
      // Assert
      (await this.cmtat.debt()).interestPaymentDate.should.equal('Test')
      expectEvent(this.logs, 'InterestPaymentDate', {
        newInterestPaymentDateIndexed: web3.utils.sha3('Test'),
        newInterestPaymentDate: 'Test'
      })
    })

    it('testAdminCanSetDayCountConvention', async function () {
      // Arrange
      (await this.cmtat.debt()).dayCountConvention.should.equal('')
      // Act
      this.logs = await this.cmtat.setDayCountConvention('Test', {
        from: owner
      });
      // Assert
      (await this.cmtat.debt()).dayCountConvention.should.equal('Test')
      expectEvent(this.logs, 'DayCountConvention', {
        newDayCountConventionIndexed: web3.utils.sha3('Test'),
        newDayCountConvention: 'Test'
      })
    })

    it('testAdminCanSetBusinessDayConvention', async function () {
      // Arrange
      (await this.cmtat.debt()).businessDayConvention.should.equal('')
      // Act
      this.logs = await this.cmtat.setBusinessDayConvention('Test', {
        from: owner
      });
      // Assert
      (await this.cmtat.debt()).businessDayConvention.should.equal('Test')
      expectEvent(this.logs, 'BusinessDayConvention', {
        newBusinessDayConventionIndexed: web3.utils.sha3('Test'),
        newBusinessDayConvention: 'Test'
      })
    })

    it('testAdminCanSetPublicHolidaysCalendar', async function () {
      // Arrange
      (await this.cmtat.debt()).publicHolidaysCalendar.should.equal('')
      // Act
      this.logs = await this.cmtat.setPublicHolidaysCalendar('Test', {
        from: owner
      });
      // Assert
      (await this.cmtat.debt()).publicHolidaysCalendar.should.equal('Test')
      expectEvent(this.logs, 'PublicHolidaysCalendar', {
        newPublicHolidaysCalendarIndexed: web3.utils.sha3('Test'),
        newPublicHolidaysCalendar: 'Test'
      })
    })

    it('testAdminCanSetIssuanceDate', async function () {
      // Arrange
      (await this.cmtat.debt()).issuanceDate.should.equal('')
      // Act
      this.logs = await this.cmtat.setIssuanceDate('Test', { from: owner });
      // Assert
      (await this.cmtat.debt()).issuanceDate.should.equal('Test')
      expectEvent(this.logs, 'IssuanceDate', {
        newIssuanceDateIndexed: web3.utils.sha3('Test'),
        newIssuanceDate: 'Test'
      })
    })

    it('testAdminCanSetCouponFrequency', async function () {
      // Arrange
      (await this.cmtat.debt()).couponFrequency.should.equal('')
      // Act
      this.logs = await this.cmtat.setCouponFrequency('Test', { from: owner });
      // Assert
      (await this.cmtat.debt()).couponFrequency.should.equal('Test')
      expectEvent(this.logs, 'CouponFrequency', {
        newCouponFrequencyIndexed: web3.utils.sha3('Test'),
        newCouponFrequency: 'Test'
      })
    })
  })

  context('NonAdminCannotSetDebt', function () {
    it('testCannotNonAdminSetDebt', async function () {
      // Act
      await expectRevertCustomError(
        this.cmtat.setDebt(
          {
            interestRate: 1,
            parValue: 2,
            guarantor: 'guarantor',
            bondHolder: 'bondHolder',
            maturityDate: 'maturityDate',
            interestScheduleFormat: 'interestScheduleFormat',
            interestPaymentDate: 'interestPaymentDate',
            dayCountConvention: 'dayCountConvention',
            businessDayConvention: 'businessDayConvention',
            publicHolidaysCalendar: 'publicHolidaysCalendar',
            issuanceDate: 'issuanceDate',
            couponFrequency: 'couponFrequency'
          },
          { from: attacker }
        ),
        'AccessControlUnauthorizedAccount',
        [attacker, DEBT_ROLE]
      )
    })

    it('testCannotNonAdminSetInterestRate', async function () {
      // Act
      await expectRevertCustomError(
        this.cmtat.setInterestRate(7, { from: attacker }),
        'AccessControlUnauthorizedAccount',
        [attacker, DEBT_ROLE]
      )
    })

    it('testCannotNonAdminSetParValue', async function () {
      // Act
      await expectRevertCustomError(
        this.cmtat.setParValue(7, { from: attacker }),
        'AccessControlUnauthorizedAccount',
        [attacker, DEBT_ROLE]
      )
    })

    it('testCannotNonAdminSetGuarantor', async function () {
      // Act
      await expectRevertCustomError(
        this.cmtat.setGuarantor('Test', { from: attacker }),
        'AccessControlUnauthorizedAccount',
        [attacker, DEBT_ROLE]
      )
    })

    it('testCannotNonAdminSetBondHolder', async function () {
      // Act
      await expectRevertCustomError(
        this.cmtat.setBondHolder('Test', { from: attacker }),
        'AccessControlUnauthorizedAccount',
        [attacker, DEBT_ROLE]
      )
    })

    it('testCannotNonAdminSetMaturityDate', async function () {
      // Act
      await expectRevertCustomError(
        this.cmtat.setMaturityDate('Test', { from: attacker }),
        'AccessControlUnauthorizedAccount',
        [attacker, DEBT_ROLE]
      )
    })

    it('testCannotNonAdminSetInterestScheduleFormat', async function () {
      // Act
      await expectRevertCustomError(
        this.cmtat.setInterestScheduleFormat('Test', { from: attacker }),
        'AccessControlUnauthorizedAccount',
        [attacker, DEBT_ROLE]
      )
    })

    it('testCannotNonAdminSetInterestPaymentDate', async function () {
      // Act
      await expectRevertCustomError(
        this.cmtat.setInterestPaymentDate('Test', { from: attacker }),
        'AccessControlUnauthorizedAccount',
        [attacker, DEBT_ROLE]
      )
    })

    it('testCannotNonAdminSetDayCountConvention', async function () {
      // Act
      await expectRevertCustomError(
        this.cmtat.setDayCountConvention('Test', { from: attacker }),
        'AccessControlUnauthorizedAccount',
        [attacker, DEBT_ROLE]
      )
    })

    it('testCannotNonAdminSetBusinessDayConvention', async function () {
      // Act
      await expectRevertCustomError(
        this.cmtat.setBusinessDayConvention('Test', { from: attacker }),
        'AccessControlUnauthorizedAccount',
        [attacker, DEBT_ROLE]
      )
    })

    it('testCannotNonAdminSetPublicHolidaysCalendar', async function () {
      // Act
      await expectRevertCustomError(
        this.cmtat.setPublicHolidaysCalendar('Test', { from: attacker }),
        'AccessControlUnauthorizedAccount',
        [attacker, DEBT_ROLE]
      )
    })

    // 'issuanceDate', 'couponFrequency'
    it('testCannotNonAdminSetIssuanceDate', async function () {
      // Act
      await expectRevertCustomError(
        this.cmtat.setIssuanceDate('Test', { from: attacker }),
        'AccessControlUnauthorizedAccount',
        [attacker, DEBT_ROLE]
      )
    })

    it('testCannotNonAdminSetCouponFrequency', async function () {
      // Act
      await expectRevertCustomError(
        this.cmtat.setCouponFrequency('Test', { from: attacker }),
        'AccessControlUnauthorizedAccount',
        [attacker, DEBT_ROLE]
      )
    })
  })
}
module.exports = BaseModuleCommon
