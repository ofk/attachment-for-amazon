(function (tiny, chrome) {
  var data = tiny.options.data || (tiny.options.data = {});
  ('rewrite_path' in data) || (data.rewrite_path = '/dp/{asin}');
  ('attach_bookmeter' in data) || (data.attach_bookmeter = true);
  ('attach_calil' in data) || (data.attach_calil = true);
  if ('associate_id' in data) delete data.associate_id;
}(this.tiny, this.chrome));
