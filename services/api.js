app.factory('responseInterceptor', function response($q, $location) {
    return {
        'responseError': function (errorResponse) {
            switch (errorResponse.status) {
                case 403:
                    $location.path('/403');
                    return $q.reject(errorResponse);
                case 404:
                    $location.path('/404');
                    return $q.reject(errorResponse);
            }
            return $q.reject(errorResponse);
        }
    };
});

app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('responseInterceptor');
}]);

app.service('api', function ($q) {
    console.log('service api')

    var fakeUsers = [
        {
            userId: 1,
            username: 'username 1',
            first_name: 'first name 1',
            last_name: 'last name 1',
            email: 'username1@gmail.com',
            password: '1234qwer', // (min length 8. at least one number and one letter )
            user_type: "Admin"
        }, //"Admin" "Driver"
        {
            userId: 2,
            username: 'username 2',
            first_name: 'first name 2',
            last_name: 'last name 2',
            email: 'username2@gmail.com',
            password: '1234qwer',
            user_type: "Driver"
        },
        {
            userId: 3,
            username: 'username 3',
            first_name: 'first name 3',
            last_name: 'last name 3',
            email: 'username3@gmail.com',
            password: '1234qwer',
            user_type: "Driver"
        }
        ,
        {
            userId: 4,
            username: 'username 4',
            first_name: 'first name 4',
            last_name: 'last name 4',
            email: 'username4@gmail.com',
            password: '1234qwer',
            user_type: "Admin"
        }
        ,
        {
            userId: 5,
            username: 'username 5',
            first_name: 'first name 5',
            last_name: 'last name 5',
            email: 'username5@gmail.com',
            password: '1234qwer',
            user_type: "Driver"
        }
    ]

    this.$usersGetAll = function () {
        // return copy of array
        return $q.resolve([...fakeUsers]);
    }

    this.$userGetById = function (userId) {
        let item = fakeUsers.find(x => x.userId === userId);
        console.log('userGetById ', userId, 'result', item, 'fakeUsers', fakeUsers);
        if (item)
            return $q.resolve(Object.assign({}, item));
        else
            return $q.resolve(null);
    }

    this.$userInsertUpdate = function (user) {
        let item = fakeUsers.find(x => x.userId === user.userId);
        let duplicate = fakeUsers.find(x => x.username === user.username);
        let result = {
            operationStatus: 0, // Unknown
            item: null
        }
        if (item) {
            if (!duplicate || duplicate.userId === item.userId) {
                item.username = user.username;
                item.first_name = user.first_name;
                item.last_name = user.last_name;
                item.email = user.email;
                item.password = user.password;
                item.user_type = user.user_type;
                result.operationStatus = 2; // Updated
                result.item = user;
                save();
            } else {
                result.operationStatus = 100; // Duplicate username;
            }
        } else {
            if (!duplicate) {
                result.item = user;
                result.item.userId = getUniqueUserId();
                result.operationStatus = 1; // Created
                fakeUsers.push(Object.assign({}, user));
                save();
            } else {
                result.operationStatus = 100; // Duplicate username;
            }
        }
        return $q.resolve(Object.assign({}, result));
    }

    this.$userDeleteById = function (userId) {
        let itemPos = fakeUsers.findIndex(x => x.userId === userId);
        if (itemPos !== -1) {
            fakeUsers.splice(itemPos, 1);
            save();
        }
        return $q.resolve();
    }

    function getUniqueUserId() {
        return Math.max(...fakeUsers.map(x => x.userId)) + 1;
    }

    function save() {
        localStorage.setItem("fakeUsers", JSON.stringify(fakeUsers));
    }

    function load() {
        let data = localStorage.getItem("fakeUsers");
        if (data && data.length > 0)
            fakeUsers = JSON.parse(data);
    }

    load();
})

