
import userModel from '~/database/models/userModel';
import { USER_ROLES } from '~/utils/constants';

const users = [
  {
    username: 'icastadmin1',
    email: 'icastadmin1@icast.com',
    password: 'icastadmin1',
    firstName: 'icast',
    lastName: 'admin1',
    balance: 500,
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.FREE_USER],
    enabled: true,
    phoneVerified: true,
    countryCode: 7,
    phoneNumber: 4990000001
  },
  {
    username: 'icastadmin2',
    email: 'icastadmin2@icast.com',
    password: 'icastadmin2',
    firstName: 'icast',
    lastName: 'admin2',
    balance: 1000,
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.PAID_USER],
    enabled: true,
    phoneVerified: true,
    countryCode: 7,
    phoneNumber: 4990000002
  },
  {
    username: 'icastuser1',
    email: 'icastuser1@icast.com',
    password: 'Icastuser1@',
    firstName: 'icast',
    lastName: 'user1',
    balance: 1000,
    roles: [USER_ROLES.FREE_USER],
    enabled: true,
    phoneVerified: true,
    countryCode: 7,
    phoneNumber: 4990000003
  },
  {
    username: 'icastuser2',
    email: 'icastuser2@icast.com',
    password: 'Icastuser2@',
    firstName: 'icast',
    lastName: 'user2',
    balance: 1000,
    roles: [USER_ROLES.FREE_USER],
    enabled: true,
    phoneVerified: true,
    countryCode: 7,
    phoneNumber: 4990000004
  },
  {
    username: 'icastuser3',
    email: 'icastuser3@icast.com',
    password: 'Icastuser3@',
    firstName: 'icast',
    lastName: 'user3',
    roles: [USER_ROLES.PAID_USER],
    enabled: true,
    phoneVerified: true,
    countryCode: 7,
    phoneNumber: 4990000005
  },
  {
    username: 'icastuser4',
    email: 'icastuser4@icast.com',
    password: 'Icastuser4@',
    firstName: 'icast',
    lastName: 'user4',
    balance: 1000,
    roles: [USER_ROLES.PAID_USER],
    enabled: true,
    phoneVerified: true,
    countryCode: 7,
    phoneNumber: 4990000006
  },
  {
    username: 'icastuser5',
    email: 'icastuser5@icast.com',
    password: 'Icastuser5@',
    firstName: 'icast',
    lastName: 'user5',
    balance: 1000,
    roles: [USER_ROLES.PAID_USER],
    enabled: true,
    phoneVerified: true,
    countryCode: 7,
    phoneNumber: 4990000007
  },
  {
    username: 'icastuser6',
    email: 'icastuser6@icast.com',
    password: 'Icastuser6@',
    firstName: 'icast',
    lastName: 'user6',
    balance: 1000,
    roles: [USER_ROLES.PAID_USER],
    enabled: true,
    phoneVerified: true,
    countryCode: 7,
    phoneNumber: 4990000008
  },
  {
    username: 'icastuser7',
    email: 'icastuser7@icast.com',
    password: 'Icastuser7@',
    firstName: 'icast',
    lastName: 'user7',
    balance: 1000,
    roles: [USER_ROLES.PAID_USER],
    enabled: true,
    phoneVerified: true,
    countryCode: 7,
    phoneNumber: 4990000009
  },
  {
    username: 'icastuser8',
    email: 'icastuser8@icast.com',
    password: 'Icastuser8@',
    firstName: 'icast',
    lastName: 'user8',
    balance: 1000,
    roles: [USER_ROLES.FREE_USER],
    enabled: true,
    phoneVerified: true,
    countryCode: 7,
    phoneNumber: 4990000010
  },
  {
    username: 'icastuser9',
    email: 'icastuser9@icast.com',
    password: 'Icastuser9@',
    firstName: 'icast',
    lastName: 'user9',
    balance: 1000,
    roles: [USER_ROLES.PAID_USER],
    enabled: true,
    phoneVerified: true,
    countryCode: 7,
    phoneNumber: 4990000011
  },
  {
    username: 'icastuser10',
    email: 'icastuser10@icast.com',
    password: 'Icastuser10@',
    firstName: 'icast',
    lastName: 'user10',
    balance: 1000,
    roles: [USER_ROLES.FREE_USER],
    enabled: true,
    phoneVerified: true,
    countryCode: 7,
    phoneNumber: 4990000012
  }
];

const startSeedingUsers = async () => {
  try {
    for (const user of users) {
      await userModel.create(user);
    }
  } catch (error) {
    console.log('[database seed user startSeedingUsers] error => ', error);
  }
};

export default startSeedingUsers;
