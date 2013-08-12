function sc(src) {
    document.write('<script src="js/'+ src +'.js"></script>');
}

sc('lib/angular/angular');
sc('lib/angular/angular-ui-router.min')
sc('filters');
sc('app');
sc('services')
sc('controllers');