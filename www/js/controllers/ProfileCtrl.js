angular.module('isgh.ProfileCtrl', ['ngSanitize'])

    .controller(
        'LoginCtrl',
        function ($scope, $filter, $ionicLoading, $rootScope, $ionicPopup, $state, $ionicNavBarDelegate, $timeout, Constant, FactoryProfile, FactoryProfileLocal, FactoryNews, FactoryLectures, FactoryEvents, FactoryBirthdays, FactoryProcselets, FactoryProcseletsLocal) {

            var io = Ionic.io();
            $scope.profile = FactoryProfileLocal.getTbProfile();
            $scope.has_input = 'app-font-size-90 app-font-color-stable';

            $scope.hasInput = function(data){
                $scope.has_input = (typeof (data) === 'undefined') ? 'app-font-size-90 app-font-color-stable' : 'has-input';
            };

            var init = function(){

                if ($scope.profile != null && $scope.profile.dsc_logged == 1) {
                    FactoryNews.newsWSgetToggleLikeds($scope.profile).then(function (resp) {
                        localStorage.setItem($scope.profile.num_matricula + "_liked", JSON.stringify(resp.data));
                        //FactoryNews.refresh(); FactoryLectures.refresh(); FactoryEvents.refresh(); FactoryBirthdays.refresh(); FactoryProcseletsLocal.refreshTbProcselets(); FactoryProcselets.refresh();
                        $state.go('tab.news');
                    });
                }

                var objFiliais = [
                    { isn_filial: "8", dsc_filial: "HGWA" },
                    { isn_filial: "2", dsc_filial: "HRC" },
                    { isn_filial: "7", dsc_filial: "HRN" },
                    { isn_filial: "1", dsc_filial: "ISGH" },
                    { isn_filial: "15", dsc_filial: "PRIMILAB GESTÃO DE LABORATÓRIO" },
                    { isn_filial: "9", dsc_filial: "SMS" },
                    { isn_filial: "4", dsc_filial: "UPA A. NUNES" },
                    { isn_filial: "6", dsc_filial: "UPA CANINDEZINHO" },
                    { isn_filial: "11", dsc_filial: "UPA C. CEARÁ" },
                    { isn_filial: "13", dsc_filial: "UPA ITAPERY" },
                    { isn_filial: "14", dsc_filial: "UPA JANGURUSSU" },
                    { isn_filial: "10", dsc_filial: "UPA J. WALTER" },
                    { isn_filial: "5", dsc_filial: "UPA MESSEJANA" },
                    { isn_filial: "3", dsc_filial: "UPA P. FUTURO" },
                    { isn_filial: "12", dsc_filial: "UPA PIRAMBU" }
                ];

                FactoryProfile.profileWSgetFilial().then(function (response) {
                    $scope.filiais = (response.data.length > 0) ? response.data : objFiliais;
                }, function (erro) {
                    $ionicPopup.alert({
                        title: 'Sem conexão com a internet',
                        template: "Ocorreu um problema ao conectar-se ao servidor verifique sua conexao e tente novamente"
                    });
                });
            };

            $timeout(function() {
                $ionicNavBarDelegate.showBar(false);
            }, 100);

            window.addEventListener('native.keyboardshow', function(){
                document.body.classList.add('keyboard-open');
            });

            $scope.searchProfile = function (login) {
                if (login) {
                    $ionicLoading.show();
                    $scope.alert = null;

                    FactoryProfile.doLogin(login).then(function (response) {
                        $ionicLoading.hide();
                        if (response.data !== "false")
                        {
                            response.data.isn_filial = login.isn_filial;
                            response.data.dsc_senha = login.dsc_senha;
                            response.data.dsc_logged = 1;
                            localStorage.setItem("profile", JSON.stringify(response.data));

                            FactoryNews.newsWSgetToggleLikeds(response.data).then(function (resp) {
                                localStorage.setItem(response.data.num_matricula + "_liked", JSON.stringify(resp.data));
                                FactoryNews.refresh(); FactoryLectures.refresh(); FactoryEvents.refresh(); FactoryBirthdays.refresh(); FactoryProcseletsLocal.refreshTbProcselets(); FactoryProcselets.refresh();
                                $state.go('tab.news');

                            }, function(error){
                                $ionicPopup.alert({
                                    title: 'Sem conexão com a internet',
                                    template: "Ocorreu um problema ao conectar-se ao servidor verifique sua conexao e tente novamente"
                                });
                                FactoryNews.refresh(); FactoryLectures.refresh(); FactoryEvents.refresh(); FactoryBirthdays.refresh(); FactoryProcseletsLocal.refreshTbProcselets(); FactoryProcselets.refresh();
                                $state.go('tab.news');
                            });

                        } else {
                            $ionicPopup.alert({
                                title: 'Dados incorretos',
                                template: 'Usuário, senha ou filial estão incorretos!'
                            });
                        }

                    }, function (erro) {
                        $ionicPopup.alert({
                            title: 'Sem conexão com a internet',
                            template: "Ocorreu um problema ao conectar-se ao servidor verifique sua conexao e tente novamente"
                        });
                    });
                }

            };

            $scope.relogProfile = function (profile) {
                if (profile) {
                    profile.dsc_logged = 1;
                    localStorage.setItem("profile", JSON.stringify(profile));
                    FactoryNews.newsWSgetToggleLikeds(profile).then(function (response) {
                        localStorage.setItem(profile.num_matricula + "_liked", JSON.stringify(response.data));
                        $state.go('tab.news');
                    }, function (erro) {
                        $ionicPopup.alert({
                            title: 'Sem conexão com a internet',
                            template: "Ocorreu um problema ao conectar-se ao servidor verifique sua conexao e tente novamente"
                        });
                    });
                }
            };

            $scope.clearProfile = function (profile) {
                $scope.profile = null;
                localStorage.removeItem("profile");
                localStorage.removeItem(profile.num_matricula + "_liked");
            };

            init();
        })

    .controller(
        'ProfileCtrl',
        function ($scope, $filter, $rootScope, ResolveProfile, Constant, FactoryProfile, $state, $ionicHistory) {
            $scope.profile = ResolveProfile;

            $scope.logoutProfile = function (profile) {
                if (profile) {
                    profile.dsc_logged = 0;
                    localStorage.setItem("profile", JSON.stringify(profile));
                    $ionicHistory.clearCache();
                    $ionicHistory.clearHistory();
                    $state.go('login');
                }
            };
        });