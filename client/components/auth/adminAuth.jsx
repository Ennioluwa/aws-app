import axios from 'axios'

// export default function AdminAuth(gssp) {
//   return async (context) => {
//     const data = await axios
//       .get(`${process.env.NEXT_PUBLIC_APP_NAME}/api/admin`, {
//         headers: {
//           cookie: context.req.headers.cookie,
//           contentType: 'application/json',
//         },
//       })
//       .then(({ data }) => {
//         console.log(data)
//         // return {
//         //   props: {
//         //     data,
//         //   },
//         // }
//       })
//       .catch(({ response }) => {
//         // return {
//         //   redirect: {
//         //     destination: '/login',
//         //     permanent: false,
//         //   },
//         //   props: {},
//         // }
//         console.log(response.data.error)
//       })
//     return {
//       props: {
//         data: data || null,
//       },
//     }
//   }
// }

export default function AdminAuth(gssp) {
  return async (context) => {
    try {
      const data = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_NAME}/api/admin`,
        {
          headers: {
            cookie: context.req.headers.cookie,
            contentType: 'application/json',
          },
        }
      )
      if (!data) {
        return {
          redirect: {
            destination: '/login',
            permanent: false,
          },
        }
      }
      if (gssp) {
        const gsspData = await gssp(context)
        return {
          props: {
            ...gsspData.props,
            user: data.user || null,
            links: data.links || null,
          },
        }
      }

      return {
        props: {
          user: data.user || null,
          links: data.links || null,
        },
      }
    } catch (error) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    }
  }
}
