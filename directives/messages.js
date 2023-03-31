app.directive('messages', function ($timeout) {
    return {
        templateUrl: "views/messages-template.html",
        restrict: "E",
        scope: {
            setSuccesMessage: '&',
            setErrorMessage: '&',
            showTime: '='
        },
        link: function (scope, element, attrs) {
            var successTimer;
            var errorTimer;

            function showSuccess(message) {
                scope.successMessage = message;
                successTimer = $timeout(() => { scope.successMessage = undefined; successTimer = undefined }, scope.showTime);
            }

            function showError(message) {
                scope.errorMessage = message;
                errorTimer = $timeout(() => { scope.errorMessage = undefined; errorTimer = undefined }, scope.showTime);
            }

            scope.setSuccesMessage({ fn: showSuccess });

            scope.setErrorMessage({ fn: showError });

            scope.$on('$destroy', function () {
                if (successTimer) $timeout.cancel(successTimer)
                if (errorTimer) $timeout.cancel(errorTimer)
            });
        }
    }
})