import { faMaximize, faCompress } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Setting2 } from 'iconsax-react'
import BNDL from 'BNDL'
import SheetMap from 'BNDL/sheetMap'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { Spinner } from 'flowbite-react'
import StickyBox from 'react-sticky-box'
import ActionBox from 'BOX/BOX_action'
import Auxiliary from 'BOX/BOX_auxiliary'
import IconText from 'RCMP/RCMP_iconText'
import IconSwitcher from 'RCMP/RCMP_iconSwitcher'
import ServicePicker from 'RCMP/RCMP_servicePicker'
import JiniSlider from 'BOX/RBOX_jini_V00.05/index'
import DropdownLarge, { IOption } from 'RCMP/RCMP_dropdown_V00.05'

interface SheetEntry {
  component: React.ComponentType<any> | null
  auxiliary?: React.ComponentType<any> | null
}

function Main () {
  const navigate = useNavigate()
  const params = useParams()

  // --- States ---
  const [showSidebar, setShowSidebar] = useState(true)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [groups, setGroups] = useState<any>({})
  const [isLoading, setIsLoading] = useState(false)

  // --- Hierarchical Navigation Logic ---
  const activeBundle =
    (BNDL as any[]).find(b => b.slug === params.bundleName) || BNDL[0]

  const findActiveItems = (bundle: any): [any, any] => {
    const service =
      bundle?.services?.find((s: any) => s.slug === params?.serviceName) ||
      bundle?.services?.[0]
    const sheet: any = params?.sheetName
      ? service?.sheets?.find((sh: any) => sh.slug === params.sheetName)
      : service?.sheets?.[0]

    return [service, sheet]
  }

  const [service, sheet]: any = findActiveItems(activeBundle)

  // --- Loading Logic on Param Change ---
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 400)

    return () => clearTimeout(timer)
  }, [params.bundleName, params.serviceName, params.sheetName])

  // --- Grouping Logic ---
  useEffect(() => {
    let list: any = {}
    const sortedSheets = [...(service?.sheets ?? [])]?.sort(
      (a: any, b: any) => a?.groupOrder - b?.groupOrder
    )

    for (const s of sortedSheets) {
      const groupName = s?.group || 'Default'
      if (!list[groupName]) list[groupName] = []
      list[groupName].push(s)
    }

    setGroups(list)
  }, [service?.sheets])

  const handleBundleChange = (bundleSlug: string) => {
    const targetBundle = (BNDL as any[]).find(b => b.slug === bundleSlug)
    const firstService = targetBundle?.services?.[0]
    const firstSheet = firstService?.sheets?.[0]
    navigate(`/${bundleSlug}/${firstService.slug}/${firstSheet.slug}`)
  }

  const handleSheetChange = (sheetSlug: string) => {
    navigate(`/${activeBundle.slug}/${service?.slug}/${sheetSlug}`)
  }

  // --- Dropdown option lists ---

  const bundleOptions: IOption[] = useMemo(
    () =>
      (BNDL as any[]).map(bundle => ({
        key: bundle.slug,
        label: bundle.bundleName,
        value: bundle.slug,
        icon: bundle.icon
      })),
    []
  )

  const sheetOptions: IOption[] = useMemo(() => {
    const sortedSheets = [...(service?.sheets ?? [])].sort(
      (a: any, b: any) => a?.groupOrder - b?.groupOrder
    )
    return sortedSheets.map((s: any) => ({
      key: s.slug,
      label: s.sheetName,
      value: s.slug,
      group: s.group || 'Default'
    }))
  }, [service?.sheets])

  const map = SheetMap as Record<string, SheetEntry>
  const DynamicComponent = map[sheet?.slug]?.component || null
  const DynamicAuxiliary = map[sheet?.slug]?.auxiliary || null

  return (
    <div className='flex gap-2 w-full h-full relative overflow-hidden'>
      <div
        className={` duration-500 ease-in-out relative self-stretch bg-neutral text-neutral-text rounded-xl shadow-sm dark:shadow-none border border-neutral-border flex flex-col overflow-y-auto custom-scrollbar min-h-full ${
          showSidebar ? 'w-3/4' : 'w-full'
        }`}
      >
        <div className={isFullScreen ? 'hidden' : 'block'}>
          {/* Header Section */}
          <JiniSlider />

          <div className='flex justify-between items-center px-3'>
            <div className='flex items-center'>
              <Setting2
                size={17}
                color='currentColor'
                className='stroke-neutral-text'
              />

              <div className='pl-3 mt-1'>
                <DropdownLarge
                  geo={{ width: '160px' }}
                  logic={{
                    options: bundleOptions,
                    value: activeBundle.slug,
                    showCounter: true,
                    onChange: value => handleBundleChange(value as string),
                    bordered: false,
                    searchable: false,
                    clearable: false,
                    indicatorIcon: 'dots',
                    placeholder: 'Select bundle'
                  }}
                />
              </div>
            </div>
          </div>

          <div className='my-2 px-3'>
            <ServicePicker
              logic={{
                CANV: activeBundle?.services || [],
                service: service,
                bundleSlug: activeBundle.slug
              }}
            />
          </div>
          <div className='w-full h-px bg-gray-100 dark:bg-gray-800 mb-2 px-3' />

          {/* Sheet Selector */}
          <div className='flex relative gap-2 mb-4 px-2 flex-col'>
            <DropdownLarge
              geo={{ width: '220px' }}
              logic={{
                options: sheetOptions,
                value: sheet?.slug,
                onChange: value => handleSheetChange(value as string),
                bordered: false,
                searchable: false,
                clearable: false,
                groupBy: true,
                hamburgerIcon: true,
                indicatorIcon: 'none',
                placeholder: 'Select sheet'
              }}
            />
            <p className='px-3'>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Voluptatum quidem ea veniam temporibus
            .
            </p>
          </div>
        </div>

        {/* Content Area with Loading Overlay */}
        <div
          className={
            isFullScreen
              ? 'fixed inset-0 z-[1000] bg-white dark:bg-gray-900 p-10 flex flex-col'
              : 'w-full h-auto relative'
          }
        >
          {isLoading && (
            <div className='absolute inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900 bg-opacity-70 dark:bg-opacity-70 backdrop-blur-[2px]  rounded-xl'>
              <Spinner size='xl' aria-label='Loading content' />
            </div>
          )}

          {isFullScreen && (
            <div className='flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-800 pb-4'>
              <div>
                <h2 className='text-2xl font-bold text-gray-800 dark:text-gray-100'>
                  {sheet?.sheetName}
                </h2>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  Full Screen Mode
                </p>
              </div>
              <button
                onClick={() => setIsFullScreen(false)}
                className='flex items-center gap-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-6 py-3 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/50  border border-red-200 dark:border-red-800'
              >
                <FontAwesomeIcon icon={faCompress} />
                <span className='font-bold'>Exit Full Screen</span>
              </button>
            </div>
          )}

          <div
            className={
              isFullScreen
                ? 'bg-slate-50 dark:bg-gray-800 rounded-2xl p-6 shadow-inner dark:shadow-none min-h-full'
                : ''
            }
          >
            <ActionBox DynamicComponent={DynamicComponent} />
          </div>
        </div>
      </div>

      {/* Auxiliary Sidebar */}
      {!isFullScreen && (
        <StickyBox
          offsetTop={0}
          offsetBottom={0}
          className={` duration-500 ease-in-out relative flex flex-col self-stretch max-h-screen ${
            showSidebar ? 'w-1/4' : 'w-0 ml-0'
          }`}
        >
          {/* Inner Card (Always matches screen height) */}
          <div
            className={`w-full h-full bg-white dark:bg-gray-900 rounded-xl shadow-sm dark:shadow-none dark:border dark:border-gray-800 transition-opacity duration-300 relative flex flex-col ${
              showSidebar ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Scrollable Auxiliary Container */}
            <div className='flex-1 overflow-y-auto py-8 custom-scrollbar  bg-neutral text-neutral-text rounded-xl shadow-sm shadow-neutral-ring'>
              {isLoading && showSidebar && (
                <div className='absolute inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900 bg-opacity-60 dark:bg-opacity-60'>
                  <Spinner size='lg' />
                </div>
              )}
              <div className='w-full flex flex-col gap-2 pb-8  bg-neutral text-neutral-text rounded-xl'>
                <Auxiliary DynamicComponent={DynamicAuxiliary} />
              </div>
            </div>
          </div>
        </StickyBox>
      )}
    </div>
  )
}

export default Main
