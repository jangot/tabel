function sc(src) {
    document.write('<script src="js/'+ src +'.js"></script>');
}

sc('lib/angular/angular');
sc('filters');
sc('app');
sc('services')
sc('controllers');