exports.DEFAULT_PROFILE_IMG = "https://moonvillageassociation.org/wp-content/uploads/2018/06/default-profile-picture1.jpg";
exports.ACCOUNT_TYPE = {
    options: [
        'super_admin',
        'customer',
    ],
    roles: {
        super_admin: 'super_admin',
        customer: 'customer',
    },
    default: 'customer',
}
exports.SALT_ROUNDS = 10;
