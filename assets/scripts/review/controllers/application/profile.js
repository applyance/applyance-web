'use strict';

module.exports = angular.module('Review')
  .controller('ApplicationProfileCtrl', ['$scope', '$filter',
    function ($scope, $filter) {

      var vertOffset = 0.0,
          pageCount = 0;

      jsPDF.API.heighten = function(offset) {
        if ((vertOffset + offset) > (11 - 1)) {
          this.addPage();
          pageCount += 1;
          vertOffset = 1;
        }
        vertOffset += offset;
        return vertOffset;
      };

      var getBase64FromImageUrl = function(url, cb) {
        var img = new Image();
        img.src = url;
        img.onload = function () {
          var canvas = document.createElement("canvas");
          canvas.width = this.width;
          canvas.height = this.height;
          var ctx = canvas.getContext("2d");
          ctx.drawImage(this, 0, 0);
          var dataURL = canvas.toDataURL("image/png");
          cb(dataURL);
        };
      };

      jsPDF.API.field = function() {
        var doc = this;
        return function(field) {
          if (!field.datum) {
            return;
          }

          doc.setFontType("bold");
          var definitionLines = doc.splitTextToSize(field.datum.definition.label, 6.5);
          var emptyLines = _.where(definitionLines, function(line) { return line.length == 0; });
          doc.text(1, doc.heighten(0.5), definitionLines)
          var defOffset = (definitionLines.length * (12 / 72)) + (emptyLines.length * .125) + 0.15;

          doc.setFontType("normal");
          var datumLines = doc.splitTextToSize(field.datum.detail.value, 6.5)
          var emptyLines = _.where(datumLines, function(line) { return line.length == 0; });
          doc.text(1, doc.heighten(defOffset), datumLines);
          var datOffset = (datumLines.length * (12 / 72)) + (emptyLines.length * .125);
          doc.heighten(datOffset);
        };
    	};

      $scope.saveAsPDF = function() {
        var doc = new jsPDF("p", "in", "letter");

        var url = $scope.getAvatarUrl();
        getBase64FromImageUrl(url, function(dataUrl) {

          // Add profile image
          doc.addImage(dataUrl, 1, doc.heighten(1), 1.5, 1.5);

          // Add name
          doc.setFont("helvetica");
          doc.setFontType("bold");
          doc.setFontSize(18);
          doc.text(2.75, doc.heighten(.25), $scope.citizen.account.name);

          // Email, phone, location
          doc.setFontSize(12);
          doc.setFontType("normal")
          var contactLines = [];
          if ($scope.profile.location) {
            contactLines.push($scope.profile.location.address.city + ", " + $scope.profile.location.address.state);
          }
          contactLines.push($scope.citizen.account.email);
          if ($scope.profile.phone_number) {
            contactLines.push($scope.profile.phone_number);
          }
          doc.text(2.75, doc.heighten(.3), contactLines);

          // Applyable
          doc.text(2.75, (doc.heighten(.95) - (12 / 72)), "Application submitted on " + moment($scope.application.submitted_at).format('MMM. D, YYYY'));

          // Line breaks

          doc.setLineWidth(0.00625);
          doc.line(1, doc.heighten(.25), 7.5, doc.heighten(0));

          doc.setLineWidth(0.025);
          doc.line(1, doc.heighten(.05), 7.5, doc.heighten(0));

          // Address
          if ($scope.profile.location) {
            doc.setFontType("bold");
            doc.text(1, doc.heighten(.5), "Address")

            doc.setFontType("normal");
            doc.text(1, doc.heighten(.3), $filter('friendlyAddress')($scope.profile.location.address).replace("<br />", ", "));
          }

          // Fields
          _.each($scope.application.fields, doc.field());

          // Save
          doc.save($scope.citizen.account.name.replace(' ', '_') + '_application_' + moment().format('YYYY-MM-DD') + '.pdf');

        });

      };

    }]);
