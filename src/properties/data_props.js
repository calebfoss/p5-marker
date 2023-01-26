export const addStorage = (baseClass) =>
  class extends baseClass {
    /**
     * The storage property allows data to be saved in local storage on
     * the device displaying the sketch. This data will remain until the
     * user clears local storage, so you can use this to remember something
     * between uses, such as the high score of a game.
     *
     * To store something, simply add a custom property to storage:
     * ```xml
     * <_ storage.my_property="123" />
     * ```
     * Any element can reference that property.
     * ```xml
     * <square x="storage.my_property" />
     * ```
     * To clear the storage, call the clear method on storage.
     * ```xml
     * <_ _="storage.clear()" />
     * ```
     * To remove a property, call the remove method and pass in the name
     * of the property as a string.
     * ```xml
     * <_ _="storage.remove('my_property')" />
     * ```
     * @type {Proxy}
     */
    get storage() {
      return new Proxy(this.pInst, {
        get(target, prop) {
          if (prop === "clear") return target.clearStorage;
          if (prop === "remove") return target.removeItem;
          return target.getItem(prop);
        },
        set(target, prop, val) {
          target.storeItem(prop, val);
          return true;
        },
      });
    }
  };
