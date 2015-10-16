/*global $, document, top, window, confirm */
/*jslint white: false, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, strict: true, newcap: true, immed: true */
'use strict';
(function () {
  var data = {
    'hermitian16': {
      'cmin': 0,
      'cmax': 12,
      'cqmin': 0,
      'cqmax': 4,
      'ql': 0,
      'qh': 4,
      'degl': 0,
      'degh': 12
    },
    'hermitian64': {
      'cmin': 0,
      'cmax': 56,
      'cqmin': 0,
      'cqmax': 8,
      'ql': 0,
      'qh': 8,
      'degl': 0,
      'degh': 10
    },
    'suzuki32': {
      'cmin': 0,
      'cmax': 248,
      'cqmin': 0,
      'cqmax': 40,
      'ql': 0,
      'qh': 40,
      'degl': 0,
      'degh': 10
    },
    'suzuki8': {
      'cmin': 0,
      'cmax': 28,
      'cqmin': 0,
      'cqmax': 12,
      'ql': 0,
      'qh': 12,
      'degl': 0,
      'degh': 12
    },
    'klein8': {
      'cmin': 0,
      'cmax': 6,
      'cqmin': 0,
      'cqmax': 6,
      'ql': 0,
      'qh': 6,
      'degl': 0,
      'degh': 6
    },
    'gk64': {
      'cmin': 0,
      'cmax': 20,
      'cqmin': 0,
      'cqmax': 8,
      'ql': 0,
      'qh': 8,
      'degl': 0,
      'degh': 20
    },
    'gk729': {
      'cmin': 0,
      'cmax': 198,
      'cqmin': 0,
      'cqmax': 27,
      'ql': 0,
      'qh': 27,
      'degl': 0,
      'degh': 10
    }
  };

  function changeCosetdist() {
    var curve = $('#curves input:checked').val(), i, curve_data = data[curve];
    if ($('#bounds input:checked').val() === 'C') {
      for (i in curve_data) {
        if (i[0] === 'c' && i !== 'cmax') {
          $('#' + i).text(curve_data[i]);
        }
        if (i === 'cmax') {
          $('#' + i).text(curve_data[i] - 1);
        }
      }
      if (($('#degh').val() - 0) > curve_data.cmax - 1) {
        $('#degh').val(curve_data.cmax - 1);
      }
      $('#fbmethods input:checkbox').attr('checked', false);
      $('#fbmethods').hide();
      if (curve === 'klein8') {
        $('#points').show();
      } else {
        $('#points').hide();
      }
    } else {
      $('#cmax').text(curve_data.cmax);
      $('#fbmethods').show();
      $('#points').hide();
    }
  }

  function changeCurve() {
    var curve = $('#curves input:checked').val(), i, curveData = data[curve];
    for (i in curveData) {
      if (i[0] === 'c') {
        $('#' + i).text(curveData[i]);
      } else {
        $('#' + i).val(curveData[i]);
      }
    }
    $('.info').hide();
    $('#' + curve + 'info').show();
    changeCosetdist();
  }

  function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  function validate() {
    return $('#curves input:checked').val() !== undefined &&
        $('input:[name=method]:checked').length > 0 &&
        $('#bounds input:checked').val() !== undefined &&
        isNumber($('#degl').val()) &&
        isNumber($('#degh').val()) &&
        $('#cmin').text() <= $('#degl').val() <= $('#degh').val() <= $('#cmax').text() &&
        isNumber($('#ql').val()) &&
        isNumber($('#qh').val()) &&
        $('#cqmin').text() <= $('#ql').val() <= $('#qh').val() <= $('#cqmax').text();
  }

  function set_button() {
    if (validate()) {
      $('#ajax').removeAttr('disabled');
    } else {
      $('#ajax').attr('disabled', 'disabled');
    }
  }

  $(document).ready(function () {
    $('a[href^="http://"]').attr('target', '_blank');

    $('#selection').keypress(function (evt) {
      if (evt.keyCode === 13) {
        $('#ajax').click();
      }
    }).click(set_button);

    $('#curves input').click(changeCurve);
    $('#bounds input').click(changeCosetdist);
    $('#ajax').click(function () {
      var boundstr = '';
      $('input:[name=method]:checked').each(function () {
        boundstr += ',' + $(this).val();
      });
      boundstr = boundstr.slice(1);
      $.post('table', {
            curve: $('#curves input:checked').val(),
            methods: boundstr,
            bound: $('#bounds input:checked').val(),
            degl: $('#degl').val(),
            degh: $('#degh').val(),
            ql: $('#ql').val(),
            qh: $('#qh').val(),
            point: $('#points input:checked').val()
          },
          function (data) {
            $('#results').html(data);
          });
      $('#results').text('loading data...');
    });
    changeCurve();
  });
}());
