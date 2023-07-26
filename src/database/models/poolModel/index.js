
import mongoose from 'mongoose';

import fixtureModel from '~/database/models/fixtureModel';
import sportsTypeModel from '~/database/models/sportsTypeModel';
import castModel from '~/database/models/castModel';
import distributingSchema from '~/database/models/distributingSchema';
import { SCORING_ALGORITHMS, POOL_STATUS } from '~/utils/constants';
import { getObjectId } from '~/utils/helpers/database';

const poolSchema = new mongoose.Schema({
  // TODO: poolGroupId -> poolGroup if we use ref
  poolGroupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'poolGroup',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  fixtures: [fixtureModel.schema],
  startDate: Date,
  endDate: Date,
  sportsType: sportsTypeModel.schema,
  status: {
    type: String,
    enum: [
      POOL_STATUS.CREATED,
      POOL_STATUS.OPENED,
      POOL_STATUS.PUBLISHED,
      POOL_STATUS.CLOSED,
      POOL_STATUS.DISABLED
    ],
    default: POOL_STATUS.CREATED,
    required: true
  },
  scoring: {
    type: String,
    enum: [SCORING_ALGORITHMS.DEFAULT]
  },
  distributing: distributingSchema,
  displayingResultSetting: {
    _id: mongoose.Schema.Types.ObjectId,
    displayingDistributedMoney: {
      type: Boolean,
      default: false
    },
    displayingTotalPlayerCount: {
      type: Boolean,
      default: false
    },
    displayingTopAmounts: {
      type: Boolean,
      default: false
    },
    displayingBottomAmounts: {
      type: Boolean,
      default: false
    },
    topAmountsCount: {
      type: Number,
      default: 0
    },
    bottomAmountsCount: {
      type: Number,
      default: 0
    }
  }
});

poolSchema.statics.deletePool = async function ({ _id }) {
  await castModel.deleteMany({ pool: _id });
  return await this.model('pool').findOneAndDelete({ _id });
};

poolSchema.pre('save', function () {
  const _id = getObjectId();
  this.displayingResultSetting._id = _id;
});

const poolModel = mongoose.model('pool', poolSchema);

export default poolModel;
