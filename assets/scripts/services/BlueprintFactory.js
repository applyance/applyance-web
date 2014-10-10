module.exports = angular.module('Apply')
  .factory("BlueprintFactory", [function() {

    return function(blueprint, opts) {

      this.blueprint = blueprint;
      this.options = _.extend({
        default: {},
        multiple: true
      }, opts || {});

      //
      // Callbacks
      //

      this.cbs = {
        defaults: {
          isValidEntry: _.bind(function(blueprint, entry) {
            var isValid = false;
            if (blueprint.is_required || !this.cbs.isEmptyEntry(blueprint, entry)) {
              isValid = this.checkRequired(entry, ['value']);
            } else {
              isValid = true;
            }
            if (entry._$mask) {
              if (entry.value && (entry.value.length > 0)) {
                isValid &= entry._$mask("isComplete");
              }
            }
            entry._valid = isValid;
            return isValid;
          }, this),
          isEmptyEntry: _.bind(function(blueprint, entry) {
            return this.isAllKeysEmpty(entry, ['value']);
          }, this),
          isValid: function(blueprint) {
            return true;
          },
          isEmpty: function(blueprint) {
            return true;
          }
        }
      };

      this.cbs.isValidEntry = this.cbs.defaults.isValidEntry;
      this.cbs.isEmptyEntry = this.cbs.defaults.isEmptyEntry;
      this.cbs.isValid = this.cbs.defaults.isValid;
      this.cbs.isEmpty = this.cbs.defaults.isEmpty;

      this._default = function() {
        return angular.copy(this.options.default);
      };

      this.init = function() {
        this.blueprint.definition.helper = this.blueprint.definition.helper || {};
        this.blueprint.definition.helper.repeatable = this.blueprint.definition.helper.repeatable || false;

        this.blueprint.datum = this.blueprint.datum || {};
        this.blueprint.datum.detail = this.blueprint.datum.detail || {};
        this.blueprint.datum.detail.repeatable = this.blueprint.definition.helper.repeatable;

        if (this.options.multiple) {
          this.blueprint.datum.detail.entries = this.blueprint.datum.detail.entries || [];
          if (this.blueprint.datum.detail.entries.length == 0) {
            this.blueprint.datum.detail.entries.push(this._default());
          }
        } else {
          this.blueprint.datum.detail.value = this.blueprint.datum.detail.value || this._default();
        }

        this.repeatable = this.blueprint.definition.helper.repeatable;
        this.blueprint.field = _.bind(this.field, this);

        return this;
      }

      this.addEntry = function() {
        this.blueprint.datum.detail.entries.push(this._default());
      };

      this.removeEntry = function(entry) {
        var index = this.blueprint.datum.detail.entries.indexOf(entry);
        this.blueprint.datum.detail.entries.splice(index, 1);
      };

      this.isValidEntry = function(cb) {
        this.cbs.isValidEntry = cb;
      };

      this.isEmptyEntry = function(cb) {
        this.cbs.isEmptyEntry = cb;
      };

      this.isValid = function(cb) {
        this.cbs.isValid = cb;
      };

      this.isEmpty = function(cb) {
        this.cbs.isEmpty = cb;
      };

      // Check if there is any field that is empty in this entry
      this.checkRequired = function(entry, keys) {
        var isValid = true;
        for (var i = 0; i < keys.length; i++) {
          var entryItem = entry[keys[i]];
          if (!entryItem || (entryItem.length == 0)) {
            isValid = false;
            break;
          }
        }
        return isValid;
      };

      // Check if all fields are empty in this entry
      this.isAllKeysEmpty = function(entry, keys) {
        var empties = 0;
        for (var i = 0; i < keys.length; i++) {
          var entryItem = entry[keys[i]];
          if (!entryItem || (entryItem.length == 0)) {
            empties++;
          }
        }
        return empties == keys.length;
      };

      this.validate = function() {
        if (this.blueprint.datum.detail.entries) {
          this.blueprint._valid = this.isAllEntriesValid(this.blueprint);
          this.blueprint._empty = this.isAnyEntryEmpty(this.blueprint);
        } else {
          this.blueprint._valid = this.cbs.isValid(this.blueprint);
          this.blueprint._empty = this.cbs.isEmpty(this.blueprint);
        }
      };

      this.cleanEntry = function(entry) {
        delete entry['repeatable'];
        for (var key in entry) {
          if (entry.hasOwnProperty(key) && (key.indexOf('_') == 0)) {
            delete entry[key];
          }
        }
      };

      this.getCleanedDatum = function() {
        var newDatum = angular.copy(this.blueprint.datum);
        if (!newDatum.detail.entries) {
          return newDatum;
        }
        newDatum.detail.entries = _.reject(newDatum.detail.entries, _.bind(function(entry) {
          return this.cbs.isEmptyEntry(this.blueprint, entry);
        }, this));
        _.each(newDatum.detail.entries, _.bind(this.cleanEntry, this));
        return newDatum;
      };

      this.isAllEntriesValid = function() {
        return _.every(this.blueprint.datum.detail.entries, _.bind(function(entry) {
          return this.cbs.isValidEntry(this.blueprint, entry);
        }, this));
      };

      this.isAllEntriesEmpty = function() {
        return _.every(this.blueprint.datum.detail.entries, _.bind(function(entry) {
          return this.cbs.isEmptyEntry(this.blueprint, entry);
        }, this));
      };

      this.isAnyEntryEmpty = function() {
        return _.some(this.blueprint.datum.detail.entries, _.bind(function(entry) {
          return this.cbs.isEmptyEntry(this.blueprint, entry);
        }, this));
      };

      this.field = function() {

        var isSendable = true;
        if (this.blueprint.datum.detail.entries) {
          isSendable = !this.isAllEntriesEmpty();
        } else {
          isSendable = !this.cbs.isEmpty(this.blueprint);
        }

        if (!isSendable) {
          return null;
        }

        var obj = {
          datum: {
            definition_id: this.blueprint.definition.id
          }
        };

        if (this.blueprint.datum.attachments) {
          obj.datum.attachments = this.blueprint.datum.attachments;
        } else {
          obj.datum.detail = this.getCleanedDatum().detail;
        }

        return obj;

      };

      return this.init();
    };

  }]);
