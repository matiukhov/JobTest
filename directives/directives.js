app.directive('checkRequired', function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, element, attrs, ngModel) {
            //console.log('check-required', scope, element, attrs, ngModel);

            ngModel.$validators.itemRequired = function (value) {
                //console.log('itemRequired', value);
                return value && value.length > 0;
            }
        }
    }
})

app.directive('checkPattern', function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, element, attrs, ngModel) {
            //console.log('check-pattern', scope, element, attrs, ngModel);
            let pattern = new RegExp(attrs['pattern']);

            ngModel.$validators.pattern = function (value) {
                //console.log('pattern check', value, 'pattern', pattern, 'test', pattern.test(value));
                return value && value.length > 0 && pattern && pattern.test(value);
            }
        }
    }
})



