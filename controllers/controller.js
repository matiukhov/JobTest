app.controller('controller', function ($scope, api, $timeout) {
    $scope.users = [];
    $scope.hideUserPanel = true;
    var showSuccess;
    var showError;

    $scope.refresh = function () {
        // get selected user
        let selectedUser = $scope.users.find(x => x.selected);
        $scope.users = [];
        api.$usersGetAll().then(data => {
            //console.log('users', data);
            // update our list
            $scope.users = data;

            // restore selected user

            // set first user by default
            let restoreSelectedUser = $scope.users && $scope.users.length > 0 ? $scope.users[0] : null;

            // if any prev user seleted
            if (selectedUser) {
                // find prev user in current list
                let curUser = $scope.users.find(x => x.userId === selectedUser.userId)
                if (curUser)
                    restoreSelectedUser = curUser;
            }

            // make selection (default user or prev selected)
            // $scope.select(restoreSelectedUser);
        })
    }

    $scope.add = function () {
        $scope.hideUserPanel = false;
        $scope.user = {};
    }

    $scope.edit = function (item) {
        $scope.hideUserPanel = false;
        $scope.user = Object.assign({}, item);
    }

    $scope.delete = function (item) {
        // find selected item
        if (item && confirm('Please confirm delete user: [' + item.username + ']')) {
            api.$userDeleteById(item.userId).then(() => {
                let userPos = $scope.users.findIndex(x => (x.userId === item.userId));
                console.log('user deleted', item, userPos, $scope.users);
                if (userPos !== -1) {
                    console.log('users splice at ' + userPos);
                    // remove user in our list
                    $scope.users.splice(userPos, 1);
                    showSuccess('User ' + item.username + ' deleted')
                }

                // move cursor
                // if ($scope.users.length > userPos) {
                //     $scope.select($scope.users[userPos]);
                // } else {
                //     if ($scope.users.length > 0) {
                //         $scope.select($scope.users[$scope.users.length - 1]);
                //     }
                // }

                $scope.hideUserPanel = true;
            })
        }
    }

    $scope.create = function () {
        api.$userInsertUpdate($scope.user).then((data) => {
            switch (data.operationStatus) {
                case 1:
                    $scope.users.push(data.item);
                    showSuccess('User ' + data.item.username + ' created');
                    $scope.cancel();
                    break;
                case 2:
                    let item = $scope.users.find(x => x.userId === data.item.userId);
                    if (item) {
                        item.username = data.item.username;
                        item.first_name = data.item.first_name;
                        item.last_name = data.item.last_name;
                        item.email = data.item.email;
                        item.password = data.item.password;
                        item.user_type = data.item.user_type;
                        showSuccess($scope.successMessage = 'User ' + data.item.username + ' edited');
                    }
                    $scope.cancel();
                    break;
                case 100:
                    showError('Username: ' + $scope.user.username + ' already exists');
                    $scope.cancel();
                    break;
                default:
                    showError('Unknown server operationStatus: ' + data.operationStatus);
                    $scope.cancel();
                    break;
            }
        });
    }

    $scope.cancel = function () {
        $scope.hideUserPanel = true;
    }

    $scope.setSuccessMessage = function (fn) {
        showSuccess = fn;
    };

    $scope.setErrorMessage = function (fn) {
        showError = fn;
    };

    $scope.refresh();
});